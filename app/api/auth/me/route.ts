import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/user-auth';
import { getQuotaAndRemaining, getUser } from '@/lib/subscriptions';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!userId) {
      return NextResponse.json({ authenticated: false });
    }

    const user = await getUser(userId);
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      userId,
      email: user.email ?? null,
      plan: user.plan ?? 'free',
      quota: await getQuotaAndRemaining(userId),
    });
  } catch (error) {
    console.error('Auth me error', error);
    return NextResponse.json({ authenticated: false });
  }
}
import { NextResponse } from 'next/server';
import { getQuotaAndRemaining } from '@/lib/subscriptions';
import { getAuthenticatedUserIdFromCookie } from '@/lib/user-auth';

export async function GET() {
  try {
    const userId = await getAuthenticatedUserIdFromCookie();
    if (!userId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const quota = await getQuotaAndRemaining(userId);
    return NextResponse.json({ authenticated: true, userId, quota });
  } catch (error) {
    console.error('Auth me error', error);
    return NextResponse.json({ error: 'Unable to fetch auth state' }, { status: 500 });
  }
}
