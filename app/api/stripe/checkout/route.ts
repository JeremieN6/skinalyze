import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuthUserIdFromRequest } from '@/lib/user-auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

type Plan = 'starter' | 'pro';

function resolvePriceId(plan: Plan) {
  if (plan === 'starter') return process.env.STRIPE_STARTER_PRICE_ID;
  return process.env.STRIPE_PRO_PRICE_ID;
}

export async function GET(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY is missing' }, { status: 500 });
    }

    const url = new URL(req.url);
    const planParam = (url.searchParams.get('plan') || '').toLowerCase();
    const userId = getAuthUserIdFromRequest(req) || url.searchParams.get('userId') || undefined;

    if (planParam !== 'starter' && planParam !== 'pro') {
      return NextResponse.json({ error: 'plan must be starter or pro' }, { status: 400 });
    }

    const plan = planParam as Plan;
    const priceId = resolvePriceId(plan);

    if (!priceId) {
      return NextResponse.json({ error: `Missing price id for plan ${plan}` }, { status: 500 });
    }

    const origin = `${url.protocol}//${url.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/diagnostic`,
      client_reference_id: userId,
      metadata: {
        plan,
        ...(userId ? { userId } : {}),
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Unable to create checkout URL' }, { status: 500 });
    }

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    console.error('Stripe checkout route error', error);
    return NextResponse.json({ error: 'Checkout creation failed' }, { status: 500 });
  }
}
