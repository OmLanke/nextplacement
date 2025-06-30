import { auth } from '@workspace/auth';
import { NextResponse } from 'next/server';

export default auth((req: any) => {
  // If the user is unauthenticated or an admin, allow the request.
  if (!req.auth || req.auth.user?.role === 'ADMIN') {
    return NextResponse.next();
  }

  // Otherwise, redirect to the student app.
  const studentUrl = process.env.STUDENT_URL ?? 'http://localhost:3000';

  return NextResponse.redirect(new URL(studentUrl, req.url));
}) as any;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
