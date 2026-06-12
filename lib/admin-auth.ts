import { cookies } from 'next/headers';

const COOKIE_NAME = 'skinalyze_session';

export function getAdminPassword() {
  return process.env.SKINALYZE_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? 'skinalyze2024';
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  return cookie?.value === getAdminPassword();
}

export function setAdminCookie(): { name: string; value: string; httpOnly: boolean; secure: boolean; sameSite: 'strict'; maxAge: number } {
  return {
    name: COOKIE_NAME,
    value: getAdminPassword(),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;
