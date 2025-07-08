import { db, applications } from '@workspace/db';
import { eq } from '@workspace/db/drizzle';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { applicationId: string } }) {
  const applicationId = Number(params.applicationId);
  if (isNaN(applicationId)) {
    return NextResponse.json({ error: 'Invalid applicationId' }, { status: 400 });
  }

  const { status } = await req.json();
  if (!status) {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 });
  }

  const result = await db.update(applications)
    .set({ status })
    .where(eq(applications.id, applicationId));

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
} 