import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME_EXPORT } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin', req.url), { status: 303 });
  res.cookies.set(COOKIE_NAME_EXPORT, '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
