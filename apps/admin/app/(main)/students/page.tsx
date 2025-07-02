import { columns, Student } from './columns';
import { DataTable } from './data-table';
import { db, students } from '@workspace/db';

async function getData(): Promise<Student[]> {
  const data = db.select().from(students);
  return data;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
