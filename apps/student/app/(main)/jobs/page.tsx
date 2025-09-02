import JobsClient from './JobClient';
import { auth } from '@/auth';
import { db, resumes, students } from '@workspace/db';
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

  // Fetch student with grades for eligibility computation
  const student = await db.query.students.findFirst({
    where: eq(students.id, studentId),
    with: { grades: true },
  });

  const studentSSC = Number((student as any)?.ssc ?? 0);
  const studentHSC = Number((student as any)?.hsc ?? 0);
  const grades = (student?.grades || []).map((g) => ({
    sem: g.sem,
    sgpi: Number(g.sgpi),
    isKT: Boolean(g.isKT),
    deadKT: Boolean(g.deadKT),
  }));
  const hasLiveKT = grades.some((g) => g.isKT);
  const hasDeadKT = grades.some((g) => g.deadKT);
  const avgCGPA = grades.length > 0 ? Number((grades.reduce((a, b) => a + (b.sgpi || 0), 0) / grades.length).toFixed(2)) : 0;

  const isEligible = (job: typeof jobs[number]) => {
    const minCGPA = Number(job.minCGPA || 0);
    const minSSC = Number(job.minSSC || 0);
    const minHSC = Number(job.minHSC || 0);
    const allowDeadKT = Boolean(job.allowDeadKT);
    const allowLiveKT = Boolean(job.allowLiveKT);

    if (avgCGPA < minCGPA) return false;
    if (studentSSC < minSSC) return false;
    if (studentHSC < minHSC) return false;
    if (!allowLiveKT && hasLiveKT) return false;
    if (!allowDeadKT && hasDeadKT) return false;
    return true;
  };

  const eligibleJobs = jobs.filter(isEligible);
  const ineligibleJobs = jobs.filter((j) => !isEligible(j));

  return (
    <JobsClient
      eligibleJobs={eligibleJobs as any}
      ineligibleJobs={ineligibleJobs as any}
      resumes={reusmes}
      studentId={studentId}
      appliedJobIds={studentAppliedJobIds}
    />
  );
}
