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
