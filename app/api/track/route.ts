import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/tracking';

export async function POST(req: NextRequest) {
  try {
    const { userId, event, sessionId } = await req.json();
    if (!userId || !event) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    await trackEvent(String(userId), String(event), String(sessionId ?? ''));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
