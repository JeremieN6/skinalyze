import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser, getQuotaAndRemaining } from '@/lib/subscriptions';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    await getOrCreateUser(userId);
    const quota = await getQuotaAndRemaining(userId);
    return NextResponse.json(quota);
  } catch (err) {
    console.error('Quota API error', err);
    return NextResponse.json({ error: 'Quota lookup failed' }, { status: 500 });
  }
}
