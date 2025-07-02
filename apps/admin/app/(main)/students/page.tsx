import { columns, Student } from './columns';
import { DataTable } from './data-table';
import { db, students } from '@workspace/db';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import { revalidatePath } from 'next/cache';
import { eq } from '@workspace/db/drizzle';
import { Card } from '@workspace/ui/components/card';

async function getData(): Promise<Student[]> {
  const data = await db.select().from(students);
  return data;
}

async function addStudent(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '').trim();
  if (!email) return;

  const exists = await db.select().from(students).where(eq(students.email, email)).limit(1);
  if (exists.length === 0) {
    await db.insert(students).values({ email });
  }
  revalidatePath('/students');
}

async function StudentsTable() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        {/* Add Student */}
        <Card className="p-6 shadow-md border border-border bg-card">
          <h2 className="text-2xl font-bold mb-4 text-primary">Add Student</h2>
          <form action={addStudent} className="flex gap-2 items-end">
            <Input name="email" type="email" placeholder="Student email" className="max-w-sm" required />
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Add Student</Button>
          </form>
        </Card>

        {/* Students Table */}
        <Card className="p-6 shadow-md border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold tracking-tight text-accent">Students</h1>
            <div className="text-sm text-muted-foreground">
              {data.length} {data.length === 1 ? 'student' : 'students'} total
            </div>
          </div>
          {data.length === 0 ? (
            <div className="text-center text-muted-foreground">No students yet. Add your first student above!</div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </Card>
      </div>
      {/* Toast placeholder for feedback */}
      
    </div>
  );
}

export default function StudentsPage() {
  return (
      <StudentsTable />
  );
}

export const dynamic = 'force-dynamic'; 