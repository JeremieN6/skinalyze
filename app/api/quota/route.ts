import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser, getQuotaAndRemaining } from '@/lib/subscriptions';
import { getAuthUserIdFromRequest } from '@/lib/user-auth';

export async function GET(req: NextRequest) {
  try {

    const url = new URL(req.url);
    const queryUserId = url.searchParams.get('userId');
    const cookieUserId = getAuthUserIdFromRequest(req);
    const userId = queryUserId || cookieUserId;
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    await getOrCreateUser(userId);
    const quota = await getQuotaAndRemaining(userId);
    return NextResponse.json({ ...quota, authenticated: Boolean(cookieUserId), userId });
  } catch (err) {
    console.error('Quota API error', err);
    return NextResponse.json({ error: 'Quota lookup failed' }, { status: 500 });
  }
}
