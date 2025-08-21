import JobsClient from './JobClient';
import { auth } from '@/auth';
import { db, resumes } from '@workspace/db';
import { eq } from '@workspace/db/drizzle';
import { getStudentApplicationJobIds } from '../actions';

export default async function JobsPage() {
  const session = await auth();
  const studentId = session?.user?.studentId!;
  const jobs = await db.query.jobs.findMany({
    with: {
      company: true,
    },
  });
  let reusmes = await db.select().from(resumes).where(eq(resumes.studentId, studentId));

  // Get student's applied job IDs
  const { success, appliedJobIds } = await getStudentApplicationJobIds(studentId);
  const studentAppliedJobIds = success ? appliedJobIds : [];

  return <JobsClient jobs={jobs} resumes={reusmes} studentId={studentId} appliedJobIds={studentAppliedJobIds} />;
}
