import JobsClient from './JobClient';
import { auth } from '@/auth';
import { db, resumes } from '@workspace/db';
import { eq } from '@workspace/db/drizzle';

export default async function JobsPage() {
  const session = await auth();
  const studentId = session?.user?.studentId!;
  const jobs = await db.query.jobs.findMany({
    with: {
      company: true,
    },
  });
  let reusmes = await db.select().from(resumes).where(eq(resumes.studentId, studentId));

  return <JobsClient jobs={jobs} resumes={reusmes} studentId={studentId} />;
}
