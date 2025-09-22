import * as z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'text/plain'];

export const jobSchema = z.object({
  companyId: z.number().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  link: z.string().url('Invalid URL'),
  description: z.string().optional(), // Made optional since file can replace it
  location: z.string().min(1, 'Location is required'),
  imageURL: z.string().url('Invalid URL').or(z.literal('')).optional(),
  salary: z.string().min(1, 'Salary is required'),
  applicationDeadline: z.date(),
  minCGPA: z.coerce.number().min(0, 'Minimum CGPA must be 0 or greater'),
  minSSC: z.coerce.number().min(0, 'Minimum SSC must be 0 or greater'),
  minHSC: z.coerce.number().min(0, 'Minimum HSC must be 0 or greater'),
  allowDeadKT: z.boolean(),
  allowLiveKT: z.boolean(),
  // File upload fields
  fileType: z.enum(['pdf', 'text']).optional(),
  descriptionFile: z.instanceof(File)
    .refine(file => file?.size <= MAX_FILE_SIZE, 'File size must be less than 5MB')
    .refine(file => ACCEPTED_FILE_TYPES.includes(file?.type), 'Only PDF and text files are allowed')
    .optional(),
}).refine(
  (data) => {
    // Either description text OR file is required
    return (data.description && data.description.trim().length > 0) || data.descriptionFile;
  },
  {
    message: 'Either provide a text description or upload a description file',
    path: ['description'],
  }
);

export type JobFormData = z.infer<typeof jobSchema>;
