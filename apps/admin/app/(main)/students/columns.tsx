import { ColumnDef } from '@tanstack/react-table';
import { createSelectSchema, students } from '@workspace/db';
import * as z from 'zod/v4';

const studentSelectSchema = createSelectSchema(students);
export type Student = z.infer<typeof studentSelectSchema>;

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'rollNumber',
    header: 'Roll Number',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'yearOfGraduation',
    header: 'Year of Graduation',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'degree',
    header: 'Degree',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'branch',
    header: 'Branch',
    filterFn: 'includesString',
  },
];
