import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAuthCode } from '@/lib/user-auth';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const value = String(email ?? '').trim();
    if (!value || !isValidEmail(value)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const { code, email: normalizedEmail } = await createAuthCode(value);

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;

    if (host && user && pass) {
      const transport = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transport.sendMail({
        from,
        to: normalizedEmail,
        subject: 'Votre code de connexion Skinalyze',
        text: `Votre code de connexion est: ${code}\n\nCe code expire dans 15 minutes.`,
        html: `<p>Votre code de connexion est : <strong style="font-size:18px;letter-spacing:2px;">${code}</strong></p><p>Ce code expire dans 15 minutes.</p>`,
      });
    } else {
      console.warn('SMTP not configured, auth code generated only for local logs');
      console.log(`[Auth Code][${normalizedEmail}] ${code}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Auth request-code error', error);
    return NextResponse.json({ error: 'Impossible d envoyer le code' }, { status: 500 });
  }
}
