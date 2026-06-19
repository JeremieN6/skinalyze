import { NextRequest, NextResponse } from 'next/server';
import { getTrialsExpiringToday, expireTrials } from '@/lib/subscriptions';
import { sendTrialExpiryReminderEmail } from '@/lib/mailer';

export const runtime = 'nodejs';

// Ce endpoint est appelé par Vercel Cron chaque jour à minuit.
// Configurer dans vercel.json :
// {
//   "crons": [{ "path": "/api/cron/trial-expiry", "schedule": "0 8 * * *" }]
// }
//
// Protéger avec CRON_SECRET dans les variables d'environnement.

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const expiringTrials = await getTrialsExpiringToday();

    let reminded = 0;
    let errors = 0;

    for (const trial of expiringTrials) {
      try {
        await sendTrialExpiryReminderEmail(
          trial.email as string,
          trial.email as string, // name fallback: email
          '',
        );
        reminded++;
      } catch (err) {
        console.error(`Failed to send expiry reminder to ${trial.email}:`, err);
        errors++;
      }
    }

    // Expirer les essais dépassés
    await expireTrials();

    return NextResponse.json({ ok: true, reminded, errors, total: expiringTrials.length });
  } catch (err) {
    console.error('Cron trial-expiry error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
