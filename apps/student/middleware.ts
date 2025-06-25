import { auth } from "@workspace/auth";
import { NextResponse } from 'next/server';

export default auth((req: any) => {
  // If the user is unauthenticated or a student, allow the request.
  if (!req.auth || req.auth.user?.role === "USER") {
    return NextResponse.next();
  }

  // Otherwise, redirect to the admin app.
  const adminURL = process.env.ADMIN_URL ?? "http://localhost:3001"

  return NextResponse.redirect(new URL(adminURL, req.url));
}) as any;

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}