import * as z from 'zod';

export const jobSchema = z.object({
  companyId: z.number().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  link: z.string().url('Invalid URL'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  imageURL: z.string().url('Invalid URL').or(z.literal('')).optional(),
  salary: z.string().min(1, 'Salary is required'),
  applicationDeadline: z.date(),
  minCGPA: z.coerce.number().min(0, 'Minimum CGPA must be 0 or greater'),
  minSSC: z.coerce.number().min(0, 'Minimum SSC must be 0 or greater'),
  minHSC: z.coerce.number().min(0, 'Minimum HSC must be 0 or greater'),
  allowDeadKT: z.boolean(),
  allowLiveKT: z.boolean(),
});

export type JobFormData = z.infer<typeof jobSchema>;
