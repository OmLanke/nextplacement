import { db, applications, students } from '@workspace/db';
import { eq } from '@workspace/db/drizzle';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { statusUpdateHtml, statusUpdateSubject, statusUpdateText } from '@/lib/mail-templates';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId: applicationIdParam } = await params;
  const applicationId = Number(applicationIdParam);
  if (isNaN(applicationId)) {
    return NextResponse.json({ error: 'Invalid applicationId' }, { status: 400 });
  }

  const { status, studentId, notify } = await req.json();
  if (!status) {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 });
  }

  let result;
  try {
    result = await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, applicationId));
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown database error';
    return NextResponse.json({ error: 'Database update failed', detail: message }, { status: 500 });
  }

  if (!result || result.rowCount === 0) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const shouldNotify = notify === undefined ? true : Boolean(notify);
  let emailError: string | undefined;
  let notified = false;
  try {
    if (shouldNotify) {
      // studentId is provided by client components; if missing, try to infer
      let effectiveStudentId: number | null = Number.isFinite(Number(studentId)) && Number(studentId) > 0 ? Number(studentId) : null;
      if (!effectiveStudentId) {
        const app = await db.query.applications.findFirst({
          where: eq(applications.id, applicationId),
          columns: { studentId: true },
        });
        effectiveStudentId = app?.studentId ?? null;
      }

      if (effectiveStudentId) {
        const student = await db.query.students.findFirst({
          where: eq(students.id, effectiveStudentId),
          columns: { email: true, firstName: true, lastName: true },
        });

        if (student?.email) {
          const name = `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim() || 'Student';
          await sendEmail({
            to: student.email,
            subject: statusUpdateSubject(status),
            text: statusUpdateText(name, status),
            html: statusUpdateHtml(name, status),
          });
          notified = true;
        }
      }
    }
  } catch (err) {
    emailError = err instanceof Error ? err.message : 'Unknown email error';
    console.error('Failed to send status update email', { applicationId, status, error: emailError });
  }

  return NextResponse.json({ success: true, emailError: emailError ?? null, notified });
} 