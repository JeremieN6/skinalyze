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

export async function sendAuthCodeEmail(email: string, code: string) {
  const config = getSmtpConfig();
  const transporter = await getTransporter(config);
  const safeEmail = escapeHtml(email);
  const safeCode = escapeHtml(code);

  await transporter.sendMail({
    from: config.from,
    to: email,
    subject: 'Code de connexion Skinalyze',
    text: [
      'Voici votre code de connexion Skinalyze :',
      code,
      '',
      'Ce code expire dans 15 minutes.',
    ].join('\n'),
    html: `
      <h2>Connexion a votre espace Skinalyze</h2>
      <p>Votre code de connexion:</p>
      <p style="font-size: 28px; font-weight: 700; letter-spacing: 0.12em; margin: 16px 0;">${safeCode}</p>
      <p>Ce code expire dans 15 minutes.</p>
      <p style="font-size: 12px; color: #7a8876;">Demande effectuee pour: ${safeEmail}</p>
    `,
  });
}

export async function sendWelcomePilotEmail(
  to: string,
  name: string,
  company: string,
  magicLink: string,
  trialEndsAt: Date,
) {
  const config = getSmtpConfig();
  const transporter = await getTransporter(config);
  const safeName = escapeHtml(name);
  const safeCompany = escapeHtml(company);
  const safeMagicLink = escapeHtml(magicLink);
  const expiryDate = trialEndsAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  await transporter.sendMail({
    from: config.from,
    to,
    subject: `Bienvenue dans le programme pilote Skinalyze — votre accès de 14 jours`,
    text: [
      `Bonjour ${name},`,
      '',
      `Votre accès pilote Skinalyze est activé pour ${company}.`,
      '',
      `Votre essai est valable jusqu'au ${expiryDate}.`,
      `Diagnostics illimités, aucune carte bancaire requise.`,
      '',
      `Accédez à votre espace ici :`,
      magicLink,
      '',
      `Ce lien est valable 7 jours. Après connexion, vous pourrez vous reconnecter à tout moment via votre email.`,
      '',
      `L'équipe Skinalyze`,
    ].join('\n'),
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; color: #1C2420;">
        <div style="background: linear-gradient(135deg, #8B9E6E, #6B7C54); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; font-family: Georgia, serif; font-size: 26px; margin: 0;">Skinalyze</h1>
          <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 8px 0 0;">Diagnostic cutané par IA</p>
        </div>
        <div style="background: #FAFAF7; padding: 40px 32px; border: 1px solid #E0DDD6; border-top: none;">
          <p style="font-size: 16px; margin: 0 0 16px;">Bonjour <strong>${safeName}</strong>,</p>
          <p style="font-size: 15px; color: #3D4A3A; line-height: 1.7; margin: 0 0 24px;">
            Votre accès pilote Skinalyze est activé pour <strong>${safeCompany}</strong>.<br>
            Vous bénéficiez de <strong>diagnostics illimités</strong> jusqu'au <strong>${expiryDate}</strong>.
          </p>
          <div style="background: white; border: 1.5px solid #E0DDD6; border-radius: 12px; padding: 20px 24px; margin: 0 0 28px;">
            <p style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #8B9E6E; margin: 0 0 12px;">Ce que vous obtenez</p>
            <ul style="margin: 0; padding: 0 0 0 18px; color: #3D4A3A; font-size: 14px; line-height: 2;">
              <li>✦ Diagnostics cutanés illimités par IA</li>
              <li>✦ Accès complet pendant 14 jours</li>
              <li>✦ Aucune carte bancaire requise</li>
              <li>✦ Votre accès expire le <strong>${expiryDate}</strong></li>
            </ul>
          </div>
          <div style="text-align: center; margin: 0 0 28px;">
            <a href="${safeMagicLink}" style="display: inline-block; background: linear-gradient(135deg, #8B9E6E, #6B7C54); color: white; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-size: 15px; font-weight: 700; letter-spacing: 0.03em;">
              Accéder à mon espace →
            </a>
          </div>
          <p style="font-size: 12px; color: #9AA898; text-align: center; margin: 0 0 24px;">
            Ce lien de connexion est valable 7 jours.<br>
            Après connexion, vous pourrez vous reconnecter à tout moment via votre email.
          </p>
          <hr style="border: none; border-top: 1px solid #E0DDD6; margin: 0 0 20px;">
          <p style="font-size: 13px; color: #7A8876; margin: 0;">
            Une question ? Répondez directement à cet email.<br>
            <em>L'équipe Skinalyze</em>
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendTrialExpiryReminderEmail(to: string, name: string, company: string) {
  const config = getSmtpConfig();
  const transporter = await getTransporter(config);
  const safeName = escapeHtml(name);
  const safeCompany = escapeHtml(company);
  const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

  await transporter.sendMail({
    from: config.from,
    to,
    subject: `Votre essai Skinalyze se termine aujourd'hui — continuez avec un abonnement`,
    text: [
      `Bonjour ${name},`,
      '',
      `Votre essai pilote Skinalyze pour ${company} prend fin aujourd'hui.`,
      '',
      `Pour continuer à utiliser les diagnostics cutanés IA sans interruption, choisissez l'abonnement qui vous convient :`,
      `${appUrl}/#pricing`,
      '',
      `L'équipe Skinalyze`,
    ].join('\n'),
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; color: #1C2420;">
        <div style="background: linear-gradient(135deg, #C4975A, #a87c46); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; font-family: Georgia, serif; font-size: 26px; margin: 0;">Skinalyze</h1>
          <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin: 8px 0 0;">Votre essai se termine aujourd'hui</p>
        </div>
        <div style="background: #FAFAF7; padding: 40px 32px; border: 1px solid #E0DDD6; border-top: none;">
          <p style="font-size: 16px; margin: 0 0 16px;">Bonjour <strong>${safeName}</strong>,</p>
          <p style="font-size: 15px; color: #3D4A3A; line-height: 1.7; margin: 0 0 24px;">
            Votre essai pilote Skinalyze pour <strong>${safeCompany}</strong> se termine <strong>aujourd'hui</strong>.<br>
            Pour ne pas perdre l'accès à vos diagnostics, choisissez un abonnement adapté à votre structure.
          </p>
          <div style="text-align: center; margin: 0 0 28px;">
            <a href="${safeCompany ? appUrl + '/#pricing' : appUrl + '/#pricing'}" style="display: inline-block; background: linear-gradient(135deg, #C4975A, #a87c46); color: white; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-size: 15px; font-weight: 700; letter-spacing: 0.03em;">
              Voir les abonnements →
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #E0DDD6; margin: 0 0 20px;">
          <p style="font-size: 13px; color: #7A8876; margin: 0;">
            Une question ? Répondez directement à cet email.<br>
            <em>L'équipe Skinalyze</em>
          </p>
        </div>
      </div>
    `,
  });
}
