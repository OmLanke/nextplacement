import { ColumnDef } from '@tanstack/react-table';
import { createSelectSchema, students } from '@workspace/db';
import * as z from 'zod/v4';

const studentSelectSchema = createSelectSchema(students);
export type Student = z.infer<typeof studentSelectSchema>;

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];
