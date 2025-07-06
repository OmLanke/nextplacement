'use server';
import {
  db,
  students,
  grades,
  internships as internshipsTable,
  resumes as resumesTable,
} from '@workspace/db';
import { eq } from '@workspace/db/drizzle';
import { studentSignupSchema, StudentSignup } from './schema';
import { auth } from '@/auth';

export async function signupAction(data: StudentSignup) {
  try {
    const session = await auth();
    const studentId = session?.user?.studentId;
    if (!studentId) {
      return { error: 'Student ID not found in session.' };
    }

    // Validate data using schema
    const parsedData = await studentSignupSchema.safeParseAsync(data);

    if (!parsedData.success) {
      return { error: parsedData.error.issues };
    }

    const student = parsedData.data;

    // Use a transaction to ensure all operations succeed or fail together
    await db.transaction(async (tx) => {
      // Update student table
      await tx
        .update(students)
        .set({
          rollNumber: student.rollNumber,
          firstName: student.firstName,
          middleName: student.middleName,
          lastName: student.lastName,
          mothersName: student.mothersName,
          gender: student.gender,
          dob: student.dob,
          personalGmail: student.personalGmail,
          phoneNumber: student.phoneNumber,
          address: student.address,
          degree: student.degree,
          branch: student.branch,
          year: student.year,
          skills: student.skills, // store as array
          linkedin: student.linkedin,
          github: student.github,
          ssc: String(student.ssc),
          hsc: String(student.hsc),
          isDiploma: student.isDiploma,
        })
        .where(eq(students.id, studentId));

      // Clear existing grades for this student
      await tx.delete(grades).where(eq(grades.studentId, studentId));

      // Insert grades (sgpi)
      if (Array.isArray(student.sgpi)) {
        for (const grade of student.sgpi) {
          await tx.insert(grades).values({
            studentId: studentId,
            sem: grade.sem,
            sgpi: String(grade.sgpi),
            isKT: grade.kt,
            deadKT: grade.ktDead,
          });
        }
      }

      // Clear existing internships for this student
      await tx.delete(internshipsTable).where(eq(internshipsTable.studentId, studentId));

      // Insert internships
      if (Array.isArray(student.internships)) {
        for (const internship of student.internships) {
          await tx.insert(internshipsTable).values({
            studentId,
            title: internship.title,
            company: internship.company,
            description: internship.description,
            location: internship.location,
            startDate: internship.startDate,
            endDate: internship.endDate,
          });
        }
      }

      // Clear existing resumes for this student
      await tx.delete(resumesTable).where(eq(resumesTable.studentId, studentId));

      // Insert resumes
      if (Array.isArray(student.resume)) {
        for (const resume of student.resume) {
          await tx.insert(resumesTable).values({
            studentId,
            title: resume.title,
            link: resume.link,
          });
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Signup action error:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred during signup.',
    };
  }
}
