import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: 'ADMIN' | 'USER';
      adminId?: number;
      studentId?: number;
      [key: string]: any;
    };
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'ADMIN' | 'USER';
    adminId?: number;
    studentId?: number;
  }
}
