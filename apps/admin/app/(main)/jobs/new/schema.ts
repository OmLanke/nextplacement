import * as z from 'zod';

export const jobSchema = z.object({
  companyId: z.number().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  link: z.string().url('Invalid URL'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  imageURL: z.string().url('Invalid URL'),
  salary: z.string().min(1, 'Salary is required'),
  applicationDeadline: z.date(),
  minCGPA: z.number().min(0),
  minSSC: z.number().min(0),
  minHSC: z.number().min(0),
  allowDeadKT: z.boolean(),
  allowLiveKT: z.boolean(),
});

export type JobFormData = z.infer<typeof jobSchema>;
