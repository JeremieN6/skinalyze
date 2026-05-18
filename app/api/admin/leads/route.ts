import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getLeads } from '@/lib/leads';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
