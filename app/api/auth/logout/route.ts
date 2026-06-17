import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/user-auth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
import { NextResponse } from 'next/server';
import { clearUserSessionByToken, USER_AUTH_COOKIE } from '@/lib/user-auth';

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const tokenEntry = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${USER_AUTH_COOKIE}=`));
    const token = tokenEntry ? decodeURIComponent(tokenEntry.split('=')[1] || '') : '';

    if (token) {
      await clearUserSessionByToken(token);
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(USER_AUTH_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    return res;
  } catch (error) {
    console.error('Auth logout error', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
