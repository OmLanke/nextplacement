import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { db, admins, students } from "@workspace/db";
import { eq } from "drizzle-orm";

const authConfig: NextAuthConfig = {
  providers: [Google],
  callbacks: {
    async jwt({ token, account, user, profile }) {
      // Only check DB on first sign in
      if (account && user && user.email) {
        const admin = await db
          .select()
          .from(admins)
          .where(eq(admins.email, user.email))
          .limit(1);
        if (admin.length > 0 && admin[0]) {
          token.role = "ADMIN";
          token.adminId = admin[0].id;
        } else {
          token.role = "USER";
          const student = await db
            .select()
            .from(students)
            .where(eq(students.email, user.email))
            .limit(1);
          if (student.length > 0 && student[0]) {
            token.studentId = student[0].id;
          } else {
            const nameParts = user.name?.split(" ") ?? [];
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";
            const newStudent = await db
              .insert(students)
              .values({
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                profilePicture: user.image,
              })
              .returning({ id: students.id });
            if (newStudent[0]) {
              token.studentId = newStudent[0].id;
            }
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role as "ADMIN" | "USER";
      }
      if (token?.adminId) {
        session.user.adminId = token.adminId as number;
      }
      if (token?.studentId) {
        session.user.studentId = token.studentId as number;
      }
      return session;
    },
  },
};

const nextAuth = NextAuth(authConfig);

export const handlers: typeof nextAuth.handlers = nextAuth.handlers;
export const signIn: typeof nextAuth.signIn = nextAuth.signIn;
export const signOut: typeof nextAuth.signOut = nextAuth.signOut;
export const auth: typeof nextAuth.auth = nextAuth.auth;
