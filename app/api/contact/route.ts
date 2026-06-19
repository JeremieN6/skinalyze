import { NextRequest, NextResponse } from 'next/server';
import { saveLead } from '@/lib/leads';
import { sendLeadNotificationEmail, sendWelcomePilotEmail } from '@/lib/mailer';
import { getOrCreateUserByEmail, activateTrial } from '@/lib/subscriptions';
import { createMagicToken } from '@/lib/user-auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, structure_type, message } = body;
    if (!name || !email || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const lead = {
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      company: String(company).slice(0, 200),
      structure_type: String(structure_type ?? '').slice(0, 100),
      message: String(message ?? '').slice(0, 2000),
    };

    let leadSaved = false;
    let emailSent = false;

    try {
      await saveLead(lead);
      leadSaved = true;
    } catch (error) {
      console.error('Lead save failed:', error);
    }

    // Créer le compte utilisateur, activer l'essai 14 jours, générer le lien magique
    let trialActivated = false;
    let welcomeEmailSent = false;

    try {
      const user = await getOrCreateUserByEmail(lead.email);
      await activateTrial(user.user_id);
      trialActivated = true;

      const token = await createMagicToken(lead.email);
      const appUrl = (process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '');
      const magicLink = `${appUrl}/api/auth/magic?token=${encodeURIComponent(token)}`;

      const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      await sendWelcomePilotEmail(lead.email, lead.name, lead.company, magicLink, trialEndsAt);
      welcomeEmailSent = true;
    } catch (error) {
      console.error('Trial activation or welcome email failed:', error);
    }

    try {
      await sendLeadNotificationEmail(lead);
      emailSent = true;
    } catch (error) {
      console.error('Lead email failed:', error);
    }

    if (!leadSaved && !trialActivated) {
      return NextResponse.json({ error: 'Unable to process contact request' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, leadSaved, emailSent, trialActivated, welcomeEmailSent });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
