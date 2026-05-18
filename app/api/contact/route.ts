import { NextRequest, NextResponse } from 'next/server';
import { saveLead } from '@/lib/leads';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, structure_type, message } = body;
    if (!name || !email || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    await saveLead({
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      company: String(company).slice(0, 200),
      structure_type: String(structure_type ?? '').slice(0, 100),
      message: String(message ?? '').slice(0, 2000),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
