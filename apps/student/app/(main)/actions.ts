'use server';
import { signOut } from '@/auth';
import { db, applications, jobs, students, resumes } from '@workspace/db';
import { eq, and } from '@workspace/db/drizzle';
import { revalidatePath } from 'next/cache';

export async function signOutAction() {
  await signOut();
}

export async function applyForJob(jobId: number, studentId: number, resumeId: number) {
  try {
    // Check if student has already applied for this job
    const existingApplication = await db.query.applications.findFirst({
      where: and(eq(applications.jobId, jobId), eq(applications.studentId, studentId)),
    });

    if (existingApplication) {
      return { success: false, error: 'You have already applied for this job' };
    }

    // Create new application
    await db.insert(applications).values({
      jobId,
      studentId,
      resumeId,
      status: 'pending',
    });

    revalidatePath('/applications');
    return { success: true };
  } catch (error) {
    console.error('Error applying for job:', error);
    return { success: false, error: 'Failed to apply for job' };
  }
}

export async function getStudentApplications(studentId: number) {
  try {
    const studentApplications = await db.query.applications.findMany({
      where: eq(applications.studentId, studentId),
      with: {
        job: {
          with: {
            company: true,
          },
        },
        resume: true,
      },
    });

    return { success: true, applications: studentApplications };
  } catch (error) {
    console.error('Error fetching student applications:', error);
    return { success: false, error: 'Failed to fetch applications' };
  }
}

export async function getStudentProfile(studentId: number) {
  try {
    const student = await db.query.students.findFirst({
      where: eq(students.id, studentId),
      with: {
        grades: true,
        resumes: true,
        internships: true,
      },
    });

    return { success: true, student };
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return { success: false, error: 'Failed to fetch student profile' };
  }
}

export async function updateStudentProfile(studentId: number, data: any) {
  try {
    await db
      .update(students)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(students.id, studentId));

    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Error updating student profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function getAvailableJobs() {
  try {
    const availableJobs = await db.query.jobs.findMany({
      where: eq(jobs.active, true),
      with: {
        company: true,
      },
    });

    return { success: true, jobs: availableJobs };
  } catch (error) {
    console.error('Error fetching available jobs:', error);
    return { success: false, error: 'Failed to fetch jobs' };
  }
}

export async function getFeaturedCompanies() {
  try {
    const companies = await db.query.companies.findMany({
      with: {
        jobs: {
          where: eq(jobs.active, true),
        },
      },
    });

    // Filter companies with active jobs and sort by number of jobs
    const companiesWithJobs = companies
      .filter((company) => company.jobs.length > 0)
      .sort((a, b) => b.jobs.length - a.jobs.length)
      .slice(0, 6); // Top 6 companies

    return { success: true, companies: companiesWithJobs };
  } catch (error) {
    console.error('Error fetching featured companies:', error);
    return { success: false, error: 'Failed to fetch companies' };
  }
}

export async function getResumes(studentId: number) {
  try {
    const r = await db.select().from(resumes).where(eq(resumes.studentId, studentId));
    return { success: true, resumes: r };
  } catch (error) {
    console.error('Error fetching resumes for studentId:', studentId, '\n', error);
    return { success: false, error: 'Failed to fetch resumes' };
  }
}

export async function getStudentApplicationJobIds(studentId: number) {
  try {
    const studentApplications = await db.query.applications.findMany({
      where: eq(applications.studentId, studentId),
      columns: {
        jobId: true,
      },
    });

    const appliedJobIds = studentApplications.map(app => app.jobId);
    return { success: true, appliedJobIds };
  } catch (error) {
    console.error('Error fetching student applied job IDs:', error);
    return { success: false, error: 'Failed to fetch applied job IDs' };
  }
}
