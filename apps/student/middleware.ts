// apps/student/middleware.ts
import { auth } from '@/auth';
import { NextResponse, NextRequest } from 'next/server';

export default auth((req: NextRequest) => {
  const { pathname } = req.nextUrl;
  // console.log('student middleware requested path:', pathname);

  // If not authenticated -> login (student side)
  if (!req.auth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = req.auth.user?.role;

  // If user is an ADMIN, prefer sending them to the admin area on the same origin
  if (role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Normal student flow
  if (role === 'USER') {
    if (!req.auth.user?.completedProfile && !pathname.startsWith('/signup')) {
      return NextResponse.redirect(new URL('/signup', req.url));
    }
    return NextResponse.next();
  }

  // Fallback
  return NextResponse.redirect(new URL('/login', req.url));
});

// IMPORTANT: exclude /admin from this matcher so student middleware never runs for /admin
export const config = {
  matcher: [
    // run for everything except api, _next static/image, favicon, login, signup, or admin
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup|admin).*)',
  ],
};
