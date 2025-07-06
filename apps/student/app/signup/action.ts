'use server'
import { db, students } from '@workspace/db';
import { eq } from '@workspace/db/drizzle';
import { studentSignupSchema } from './schema';
import { auth } from '@/auth';

export async function signupAction(data: FormData) {
    const session = await auth();
    const studentId = session?.user?.studentId;
    if (!studentId) {
        return { error: 'Student ID not found in session.' };
    }

    const formData = Object.fromEntries(data.entries());
    const parsedData = await studentSignupSchema.safeParseAsync(formData);

    if (!parsedData.success) {
        return { error: parsedData.error.issues };
    }

    const student = parsedData.data;

    await db.update(students).set({
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
        skills: student.skills,
        linkedin: student.linkedin,
        github: student.github,
        ssc: String(student.ssc),
        hsc: String(student.hsc),
        isDiploma: student.isDiploma,
    }).where(eq(students.id, studentId));

}

