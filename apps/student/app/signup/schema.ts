import { z } from "zod";

export const sgpiSchema = z.object({
  sem: z.number().min(1).max(8),
  sgpi: z.number().min(0).max(10),
  kt: z.boolean(),
  ktDead: z.boolean(),
});

export const internshipSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    company: z.string().min(1, 'Company is required'),
    description: z.string().min(1, 'Description is required'),
    location: z.string().min(1, 'Location is required'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const resumeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  link: z.string().url('Must be a valid URL'),
});

export const studentSignupSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required').max(12),
  firstName: z.string().min(1, 'First name is required').max(255),
  middleName: z.string().max(255).optional(),
  lastName: z.string().min(1, 'Last name is required').max(255),
  mothersName: z.string().min(1, "Mother's name is required").max(255),
  gender: z.string().min(1, 'Gender is required').max(10),
  dob: z.coerce.date().refine((date) => date <= new Date(), {
    message: 'Date of birth cannot be in the future',
  }),
  personalGmail: z.string().email('Must be a valid email'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(10),
  address: z.string().min(1, 'Address is required'),
  degree: z.string().min(1, 'Degree is required'),
  branch: z.string().min(1, 'Branch is required'),
  year: z.string().min(1, 'Year is required'),
  skills: z.array(z.string()),
  linkedin: z.string(),
  github: z.string(),
  ssc: z.coerce.number().min(0).max(100),
  hsc: z.coerce.number().min(0).max(100),
  isDiploma: z.boolean(),
  sgpi: z.array(sgpiSchema).length(8, 'Must provide grades for all 8 semesters'),
  internships: z.array(internshipSchema),
  resume: z.array(resumeSchema),
});

export type StudentSignup = z.infer<typeof studentSignupSchema>;
export type Internship = z.infer<typeof internshipSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type SGPI = z.infer<typeof sgpiSchema>;