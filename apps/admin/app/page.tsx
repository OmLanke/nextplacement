import Login from "@/components/login";
import Studs from "@/components/studs";
import { db, students } from "@workspace/db";
import { signIn, signOut } from "@workspace/auth";

async function getStudents() {
  "use server";
  const s = await db.select().from(students);
  console.log(s);
}

async function logIn() {
  "use server";
  await signIn("google");
}

async function logOut() {
  "use server";
  await signOut();
}

export default async function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello admins</h1>
        <Login logIn={logIn} />
        <Studs action={getStudents} logOut={logOut} />
      </div>
    </div>
  );
}
