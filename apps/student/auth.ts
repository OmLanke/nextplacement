import NextAuth, { type DefaultSession } from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Google from "next-auth/providers/google";
import { db, admins, students } from '@workspace/db';
import { eq } from '@workspace/db/drizzle';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: 'ADMIN' | 'USER';
      adminId?: number;
      studentId?: number;
      completedProfile?: boolean;
      [key: string]: any;
    } & DefaultSession["user"];
  }
  
  interface JWT {
    role?: 'ADMIN' | 'USER';
    adminId?: number;
    studentId?: number;
    // completedProfile?: boolean; // Removed from JWT
  }
}

declare module 'next/server' {
  interface NextRequest {
    auth: import('next-auth').Session | null;
  }
}

const authConfig: NextAuthConfig = {
  providers: [Google],
  callbacks: {
    async jwt({ token, account, user }) {
      // Only set role, adminId, studentId, and email in JWT
      const email = user?.email || token?.email;
      if (!email) return token;

      const admin = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
      if (admin.length > 0 && admin[0]) {
        token.role = 'ADMIN';
        token.adminId = admin[0].id;
        token.email = email;
        return token;
      }

      let student = await db.select().from(students).where(eq(students.email, email)).limit(1);
      if (student.length > 0 && student[0]) {
        token.role = 'USER';
        token.studentId = student[0].id;
        token.email = email;
        return token;
      }

      if (user) {
        const nameParts = user.name?.split(' ') ?? [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        const newStudent = await db
          .insert(students)
          .values({
            email: email,
            firstName: firstName,
            lastName: lastName,
            profilePicture: user.image,
          })
          .returning({ id: students.id });
        if (newStudent[0]) {
          token.role = 'USER';
          token.studentId = newStudent[0].id;
          token.email = email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role as 'ADMIN' | 'USER';
      }
      if (token?.adminId) {
        session.user.adminId = token.adminId as number;
      }
      if (token?.studentId) {
        session.user.studentId = token.studentId as number;
      }
      // Fetch completedProfile from DB for students only
      if (token?.role === 'USER' && token?.studentId) {
        const student = await db.select().from(students).where(eq(students.id, token.studentId as number)).limit(1);
        session.user.completedProfile = student[0]?.rollNumber ? true : false;
      } else if (token?.role === 'ADMIN') {
        session.user.completedProfile = true;
      }
      return session;
    },
  },
};

// Note: TypeScript warnings about inferred types are expected with NextAuth v5 beta
// These warnings don't affect functionality
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
