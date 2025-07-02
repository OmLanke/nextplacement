import { auth } from '@/auth';
import { NextResponse, NextRequest } from 'next/server';

export default auth((req: NextRequest) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (req.auth.user?.role === 'ADMIN') {
    return NextResponse.next();
  }

  // Otherwise, redirect to the student app.
  const studentUrl = process.env.STUDENT_URL ?? 'http://localhost:3000';

  return NextResponse.redirect(new URL(studentUrl, req.url));
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
