import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicToken, AUTH_COOKIE_NAME } from '@/lib/user-auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token || typeof token !== 'string' || token.length > 200) {
    return NextResponse.redirect(new URL('/?error=lien-invalide', req.url));
  }

  try {
    const result = await verifyMagicToken(token);

    if (!result) {
      return NextResponse.redirect(new URL('/?error=lien-expire', req.url));
    }

    const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? '';
    const diagnosticUrl = appUrl ? new URL('/diagnostic', appUrl) : new URL('/diagnostic', req.url);

    const response = NextResponse.redirect(diagnosticUrl);
    response.cookies.set(AUTH_COOKIE_NAME, result.userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 90, // 90 jours
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Magic link verification failed:', err);
    return NextResponse.redirect(new URL('/?error=erreur-connexion', req.url));
  }
}
