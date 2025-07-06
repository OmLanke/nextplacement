'use server'
import { db, students, grades, internships as internshipsTable, resumes as resumesTable } from '@workspace/db';
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
    // Parse arrays/objects from formData if sent as JSON strings
    if (typeof formData.skills === 'string') formData.skills = JSON.parse(formData.skills);
    if (typeof formData.sgpi === 'string') formData.sgpi = JSON.parse(formData.sgpi);
    if (typeof formData.internships === 'string') formData.internships = JSON.parse(formData.internships);
    if (typeof formData.resume === 'string') formData.resume = JSON.parse(formData.resume);

    const parsedData = await studentSignupSchema.safeParseAsync(formData);

    if (!parsedData.success) {
        return { error: parsedData.error.issues };
    }

    const student = parsedData.data;

    // Update student table
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
        skills: student.skills, // store as array
        linkedin: student.linkedin,
        github: student.github,
        ssc: String(student.ssc),
        hsc: String(student.hsc),
        isDiploma: student.isDiploma,
    }).where(eq(students.id, studentId));

    // Upsert grades (sgpi)
    if (Array.isArray(student.sgpi)) {
        for (const grade of student.sgpi) {
            await db.insert(grades).values({
                studentId: studentId,
                sem: grade.sem,
                sgpi: String(grade.sgpi),
                isKT: grade.kt,
                deadKT: grade.ktDead,
            }).onConflictDoUpdate({
                target: [grades.studentId, grades.sem],
                set: {
                    sgpi: String(grade.sgpi),
                    isKT: grade.kt,
                    deadKT: grade.ktDead,
                    updatedAt: new Date(),
                },
            });
        }
    }

    // Upsert internships
    if (Array.isArray(student.internships)) {
        for (const internship of student.internships) {
            await db.insert(internshipsTable).values({
                studentId,
                title: internship.title,
                company: internship.company,
                description: internship.description,
                location: internship.location,
                startDate: internship.startDate,
                endDate: internship.endDate,
            }).onConflictDoUpdate({
                target: [internshipsTable.studentId, internshipsTable.title, internshipsTable.company],
                set: {
                    description: internship.description,
                    location: internship.location,
                    startDate: internship.startDate,
                    endDate: internship.endDate,
                    updatedAt: new Date(),
                },
            });
        }
    }

    // Upsert resumes
    if (Array.isArray(student.resume)) {
        for (const resume of student.resume) {
            await db.insert(resumesTable).values({
                studentId,
                title: resume.title,
                link: resume.link,
            }).onConflictDoUpdate({
                target: [resumesTable.studentId, resumesTable.title],
                set: {
                    link: resume.link,
                    updatedAt: new Date(),
                },
            });
        }
    }

    return { success: true };
}

