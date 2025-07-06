import { auth } from '@/auth';
import { NextResponse, NextRequest } from 'next/server';

export default auth((req: NextRequest) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (req.auth.user?.role === 'USER') {
    if (!req.auth.user?.completedProfile && !req.nextUrl.pathname.startsWith('/signup')) {
      const signupUrl = process.env.STUDENT_PROFILE_URL ?? 'http://localhost:3000/signup';
      return NextResponse.redirect(new URL(signupUrl, req.url));
    }

    return NextResponse.next();
  }

  const adminUrl = process.env.ADMIN_URL ?? 'http://localhost:3001';

  return NextResponse.redirect(new URL(adminUrl, req.url));
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
