import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifyAuthCode } from '@/lib/user-auth';
import { getQuotaAndRemaining, getUser } from '@/lib/subscriptions';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    const result = await verifyAuthCode(String(email ?? ''), String(code ?? ''));

    if (!result) {
      return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 401 });
    }

    const response = NextResponse.json({
      ok: true,
      userId: result.userId,
      email: result.email,
      quota: await getQuotaAndRemaining(result.userId),
      user: await getUser(result.userId),
    });

    response.cookies.set(AUTH_COOKIE_NAME, result.userId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error('Auth verify-code error', error);
    return NextResponse.json({ error: 'Impossible de vérifier le code' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import {
  getLatestCustomerByEmail,
  getOrCreateUserByEmail,
  getQuotaAndRemaining,
  linkCustomerToUser,
  upsertCustomerFromStripe,
} from '@/lib/subscriptions';
import {
  createUserSession,
  getUserAuthCookieConfig,
  verifyOtpCode,
} from '@/lib/user-auth';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const emailNorm = String(email ?? '').trim().toLowerCase();
    const codeNorm = String(code ?? '').trim();

    if (!emailNorm || !codeNorm) {
      return NextResponse.json({ error: 'Email et code requis' }, { status: 400 });
    }

    const valid = await verifyOtpCode(emailNorm, codeNorm);
    if (!valid) {
      return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 401 });
    }

    const user = await getOrCreateUserByEmail(emailNorm);

    // Sync best known Stripe customer by email to restore plan across devices.
    const customer = await getLatestCustomerByEmail(emailNorm);
    if (customer?.stripe_customer_id) {
      await upsertCustomerFromStripe(
        customer.stripe_customer_id,
        customer.email ?? emailNorm,
        customer.plan ?? 'starter',
        customer.plan_status ?? 'active',
      );
      await linkCustomerToUser(customer.stripe_customer_id, user.user_id);
    }

    const sessionToken = await createUserSession(user.user_id);
    const quota = await getQuotaAndRemaining(user.user_id);

    const response = NextResponse.json({ ok: true, quota });
    const cookieConfig = getUserAuthCookieConfig(sessionToken);
    response.cookies.set(cookieConfig.name, cookieConfig.value, {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
      maxAge: cookieConfig.maxAge,
    });

    return response;
  } catch (error) {
    console.error('Auth verify-code error', error);
    return NextResponse.json({ error: 'Connexion impossible' }, { status: 500 });
  }
}
