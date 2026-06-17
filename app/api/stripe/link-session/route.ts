import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { linkCustomerToUser, upsertCustomerFromStripe } from '@/lib/subscriptions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

function normalizePlan(value: string | null | undefined) {
  const plan = String(value ?? '').trim().toLowerCase();
  if (plan === 'starter' || plan === 'pro') return plan;
  return process.env.STRIPE_DEFAULT_PLAN || 'starter';
}

function resolvePlan(priceId?: string | null, fallback?: string | null) {
  if (priceId && process.env.STRIPE_STARTER_PRICE_ID && priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter';
  if (priceId && process.env.STRIPE_PRO_PRICE_ID && priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro';
  return normalizePlan(fallback);
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, userId } = await req.json();
    if (!sessionId || !userId) {
      return NextResponse.json({ error: 'sessionId and userId are required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 1 });
    const priceId = lineItems.data[0]?.price?.id ?? null;
    const plan = resolvePlan(priceId, session.metadata?.plan ?? session.client_reference_id ?? null);
    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

    if (!stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer on session' }, { status: 400 });
    }

    await upsertCustomerFromStripe(stripeCustomerId, session.customer_details?.email ?? undefined, plan, 'active');
    await linkCustomerToUser(stripeCustomerId, userId);

    return NextResponse.json({ ok: true, plan });
  } catch (error) {
    console.error('Stripe session link failed', error);
    return NextResponse.json({ error: 'Unable to link Stripe session' }, { status: 500 });
  }
}
