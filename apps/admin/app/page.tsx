import Login from '@/components/login';
import Studs from '@/components/studs';
import { db, admins } from '@workspace/db';
import { auth, signIn, signOut } from '@workspace/auth';

async function getStudents() {
  'use server';
  const s = await db.select().from(admins);
  console.log(s);
}

async function logIn() {
  'use server';
  await signIn('google');
}

async function logOut() {
  'use server';
  await signOut();
}

export default async function Page() {
  const session = await auth();
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello admin {session?.user?.name}</h1>
        {!session?.user && <Login action={logIn} />}
        <Studs action={getStudents} logOut={logOut} />
      </div>
    </div>
  );
}
