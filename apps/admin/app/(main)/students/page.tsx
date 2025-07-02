import { columns, Student } from './columns';
import { DataTable } from './data-table';
import { db, students } from '@workspace/db';

async function getData(): Promise<Student[]> {
  const data = await db.select().from(students);
  return data;
}

async function StudentsTable() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
          <div className="text-sm text-muted-foreground">
            {data.length} {data.length === 1 ? 'student' : 'students'} total
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default function StudentsPage() {
  return (
      <StudentsTable />
  );
}

export const dynamic = 'force-dynamic'; 