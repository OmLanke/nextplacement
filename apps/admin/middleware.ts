// apps/admin/middleware.ts
import { auth } from '@/auth';
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';

export default auth((req: NextRequest) => {
  const { pathname } = req.nextUrl;
  // console.log('admin middleware requested path:', pathname);

  const bypassRegex = /^\/(api|_next\/static|_next\/image|favicon\.ico|login|signup|admin-static).*$/;

  // console.log("Bypass regex test:", bypassRegex.test(pathname));

  if (bypassRegex.test(pathname)) {
    // console.log("Bypassing admin middleware for path:", pathname);
    return NextResponse.next();
  }

  if (!req.auth) {
    // admin login page should be under /admin/login so we stay on the same origin
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  // console.log("ROLE: ", req.auth.user?.role)
  if (req.auth.user?.role !== 'ADMIN') {
    // Non-admins must go back to the student app at /
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

// export const config = {
//   // only run admin middleware for /admin and its subpaths
//   matcher: ['/admin/:path*'],
// };

// export const config = {
//   matcher: [
//     // run for everything except api, _next static/image, favicon, login, signup
//     '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
//   ],
// };
