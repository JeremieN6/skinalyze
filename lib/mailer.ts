import nodemailer from 'nodemailer';

type LeadPayload = {
  name: string;
  email: string;
  company: string;
  structure_type: string;
  message: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
  secure: boolean;
};

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST?.trim() ?? '';
  const port = Number(process.env.SMTP_PORT ?? '587');
  const user = process.env.SMTP_USER?.trim() ?? '';
  const pass = process.env.SMTP_PASS ?? '';
  const from = process.env.SMTP_FROM?.trim() || user;
  const to = process.env.SMTP_TO?.trim() || user;

  if (!host || !port || !user || !pass || !from || !to) {
    throw new Error('SMTP environment variables are missing or invalid.');
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    to,
    secure: port === 465,
  };
}

function getTransporter(config: SmtpConfig) {
  if (!transporterPromise) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      }),
    );
  }

  return transporterPromise;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function sendLeadNotificationEmail(lead: LeadPayload) {
  const config = getSmtpConfig();
  const transporter = await getTransporter(config);

  const safeName = escapeHtml(lead.name);
  const safeEmail = escapeHtml(lead.email);
  const safeCompany = escapeHtml(lead.company);
  const safeType = escapeHtml(lead.structure_type || 'Non renseigne');
  const safeMessage = escapeHtml(lead.message || 'Aucun message');

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: lead.email,
    subject: `Nouvelle demande d'acces pilote - ${lead.company}`,
    text: [
      "Nouvelle demande d'acces pilote",
      `Nom: ${lead.name}`,
      `Email: ${lead.email}`,
      `Entreprise: ${lead.company}`,
      `Type de structure: ${lead.structure_type || 'Non renseigne'}`,
      `Message: ${lead.message || 'Aucun message'}`,
    ].join('\n'),
    html: `
      <h2>Nouvelle demande d'acces pilote</h2>
      <p><strong>Nom:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Entreprise:</strong> ${safeCompany}</p>
      <p><strong>Type de structure:</strong> ${safeType}</p>
      <p><strong>Message:</strong><br />${safeMessage.replaceAll('\n', '<br />')}</p>
    `,
  });
}
