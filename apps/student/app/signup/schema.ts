import { z } from "zod";

export const sgpiSchema = z.object({
  sem: z.number().min(1).max(8),
  sgpi: z.number().min(0).max(10),
  kt: z.boolean(),
  ktDead: z.boolean(),
});

export const internshipSchema = z.object({
  title: z.string(),
  company: z.string(),
  description: z.string(),
  location: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const resumeSchema = z.object({
  title: z.string(),
  link: z.string().url(),
});

export const studentSignupSchema = z.object({
  rollNumber: z.string().max(12),
  firstName: z.string().max(255),
  middleName: z.string().max(255),
  lastName: z.string().max(255),
  mothersName: z.string().max(255),
  gender: z.string().max(10),
  dob: z.coerce.date(),
  personalGmail: z.string().email(),
  phoneNumber: z.string().max(10),
  address: z.string(),
  degree: z.string(),
  branch: z.string(),
  year: z.string(),
  skills: z.array(z.string()),
  linkedin: z.string(),
  github: z.string(),
  ssc: z.coerce.number(),
  hsc: z.coerce.number(),
  isDiploma: z.boolean(),
  sgpi: z.array(sgpiSchema),
  internships: z.array(internshipSchema).optional(),
  resume: z.array(resumeSchema).optional(),
});

export type StudentSignup = z.infer<typeof studentSignupSchema>;
export type Internship = z.infer<typeof internshipSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type SGPI = z.infer<typeof sgpiSchema>;