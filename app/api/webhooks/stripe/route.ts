import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { linkCustomerToUser, upsertCustomerFromStripe } from '@/lib/subscriptions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

function normalizePlan(plan: string | undefined | null) {
  const value = String(plan ?? '').trim().toLowerCase();
  if (value === 'pro') return 'pro';
  if (value === 'starter') return 'starter';
  return process.env.STRIPE_DEFAULT_PLAN || 'starter';
}

function resolvePlanFromPrice(priceId?: string | null, fallbackPlan?: string | null) {
  if (priceId && process.env.STRIPE_STARTER_PRICE_ID && priceId === process.env.STRIPE_STARTER_PRICE_ID) {
    return 'starter';
  }
  if (priceId && process.env.STRIPE_PRO_PRICE_ID && priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return 'pro';
  }
  return normalizePlan(fallbackPlan);
}

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('stripe-signature') || '';
    const raw = await req.text();
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn('Stripe webhook secret not configured; skipping signature verification');
      const event = JSON.parse(raw);
      await handleEvent(event);
      return NextResponse.json({ received: true });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Stripe signature verification failed', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    await handleEvent(event);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

async function handleEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const customer = session.customer as string | Stripe.Customer;
      const email = session.customer_details?.email ?? (typeof customer === 'object' ? customer.email : undefined);
      const stripeCustomerId = typeof customer === 'string' ? customer : (customer as Stripe.Customer).id;
      const lineItems = session.line_items?.data ?? (await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })).data;
      const firstPriceId = lineItems[0]?.price?.id ?? null;
      const metadataPlan = session.metadata?.plan ?? session.client_reference_id ?? null;
      const plan = resolvePlanFromPrice(firstPriceId, metadataPlan);

      await upsertCustomerFromStripe(stripeCustomerId, email ?? undefined, plan, 'active');

      const userId = session.metadata?.userId ?? session.client_reference_id ?? null;
      if (userId) {
        await linkCustomerToUser(stripeCustomerId, userId);
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.created':
    case 'customer.subscription.deleted':
    case 'invoice.payment_succeeded': {
      const obj = event.data.object as Stripe.Subscription | Stripe.Invoice;
      const stripeCustomerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id;
      const priceId = 'items' in obj ? obj.items?.data?.[0]?.price?.id ?? null : null;
      const nickname = 'items' in obj ? obj.items?.data?.[0]?.price?.nickname ?? null : null;
      const plan = resolvePlanFromPrice(priceId, nickname);
      const status = 'status' in obj ? obj.status ?? 'active' : 'active';

      if (stripeCustomerId) {
        await upsertCustomerFromStripe(stripeCustomerId, undefined, plan, status);
      }
      break;
    }
    default:
      // ignore unsupported events
      break;
  }
}
