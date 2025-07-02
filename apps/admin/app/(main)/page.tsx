import Studs from '@/components/studs';
import { db, students } from '@workspace/db';
import { auth, signOut } from '@/auth';

async function getStudents() {
  'use server';
  const s = await db.select().from(students);
  console.log(s);
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
        <Studs action={getStudents} logOut={logOut} />
      </div>
    </div>
  );
}
