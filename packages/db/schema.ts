import { sql, relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  numeric,
  primaryKey,
  check,
} from 'drizzle-orm/pg-core';

export { createSelectSchema } from 'drizzle-zod';

export const students = pgTable('students', {
  id: serial().primaryKey(),
  email: text().notNull(),
  rollNumber: varchar({ length: 12 }),
  verified: boolean().notNull().default(false),
  firstName: varchar({ length: 255 }),
  middleName: varchar({ length: 255 }),
  lastName: varchar({ length: 255 }),
  mothersName: varchar({ length: 255 }),
  gender: varchar({ length: 10 }),
  dob: timestamp(),
  personalGmail: text(),
  phoneNumber: varchar({ length: 10 }),
  address: text(),
  profilePicture: text(),
  degree: text(),
  branch: text(),
  year: text(),
  skills: text()
    .array()
    .default(sql`ARRAY[]::text[]`),
  linkedin: text(),
  github: text(),
  ssc: numeric({ precision: 4, scale: 2 }), // TODO: year, board
  hsc: numeric({ precision: 4, scale: 2 }), // TODO: year, board
  isDiploma: boolean(), // TODO: diploma branch
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const internships = pgTable('internships', {
  id: serial().primaryKey(),
  studentId: integer('student_id')
    .notNull()
    .references(() => students.id),
  title: text().notNull(),
  company: text().notNull(),
  description: text().notNull(),
  location: text().notNull(),
  startDate: timestamp().notNull(),
  endDate: timestamp().notNull(),
  // status: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// export const projects = pgTable("projects", {
//   id: serial().primaryKey(),
//   studentId: integer("student_id")
//     .notNull()
//     .references(() => students.id),
//   title: text().notNull(),
//   description: text().notNull(),
//   links: text()
//     .array()
//     .notNull()
//     .default(sql`ARRAY[]::text[]`),
//   createdAt: timestamp().notNull().defaultNow(),
//   updatedAt: timestamp()
//     .defaultNow()
//     .$onUpdate(() => new Date())
//     .notNull(),
// });

// export const certificates = pgTable("certificates", {
//   id: serial().primaryKey(),
//   studentId: integer("student_id")
//     .notNull()
//     .references(() => students.id),
//   title: text().notNull(),
//   description: text().notNull(),
//   link: text().notNull(),
//   createdAt: timestamp().notNull().defaultNow(),
//   updatedAt: timestamp()
//     .defaultNow()
//     .$onUpdate(() => new Date())
//     .notNull(),
// });

export const resumes = pgTable('resumes', {
  id: serial().primaryKey(),
  studentId: integer('student_id')
    .notNull()
    .references(() => students.id),
  title: text().notNull(),
  link: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const grades = pgTable(
  'grades',
  {
    studentId: integer('student_id')
      .notNull()
      .references(() => students.id),
    sem: integer().notNull(),
    sgpi: numeric({ precision: 4, scale: 2 }).notNull(),
    isKT: boolean().notNull(),
    deadKT: boolean(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.studentId, table.sem] }),
    check('sem_check1', sql`${table.sem} < 9`),
  ],
);

export const studentRelations = relations(students, ({ many }) => ({
  internships: many(internships),
  // projects: many(projects),
  // certificates: many(certificates),
  resumes: many(resumes),
  grades: many(grades),
}));

export const internshipRelations = relations(internships, ({ one }) => ({
  student: one(students, {
    fields: [internships.studentId],
    references: [students.id],
  }),
}));

// export const projectRelations = relations(projects, ({ one }) => ({
//   student: one(students, {
//     fields: [projects.studentId],
//     references: [students.id],
//   }),
// }));

// export const certificateRelations = relations(certificates, ({ one }) => ({
//   student: one(students, {
//     fields: [certificates.studentId],
//     references: [students.id],
//   }),
// }));

export const resumeRelations = relations(resumes, ({ one, many }) => ({
  student: one(students, {
    fields: [resumes.studentId],
    references: [students.id],
  }),
  applications: many(applications),
}));

export const gradeRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.id],
  }),
}));

export const companies = pgTable('companies', {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  link: text().notNull(),
  description: text().notNull(),
  // passwordHash: text(),
  imageURL: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const jobs = pgTable('jobs', {
  id: serial().primaryKey(),
  companyId: integer('company_id')
    .notNull()
    .references(() => companies.id),
  title: text().notNull(),
  link: text().notNull(),
  description: text().notNull(),
  location: text().notNull(),
  imageURL: text().notNull(),
  salary: text().notNull(),
  applicationDeadline: timestamp().notNull(),
  active: boolean().notNull().default(false),
  minCGPA: numeric({ precision: 4, scale: 2 }).notNull().default('0'),
  minSSC: numeric({ precision: 4, scale: 2 }).notNull().default('0'),
  minHSC: numeric({ precision: 4, scale: 2 }).notNull().default('0'),
  allowDeadKT: boolean().notNull().default(true),
  allowLiveKT: boolean().notNull().default(true),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const applications = pgTable('applications', {
  id: serial().primaryKey(),
  jobId: integer('job_id')
    .notNull()
    .references(() => jobs.id),
  studentId: integer('student_id')
    .notNull()
    .references(() => students.id),
  resumeId: integer('resume_id')
    .notNull()
    .references(() => resumes.id),
  status: text().notNull().default('pending'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const comapnyRelations = relations(companies, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  student: one(students, {
    fields: [applications.studentId],
    references: [students.id],
  }),
  resume: one(resumes, {
    fields: [applications.resumeId],
    references: [resumes.id],
  }),
}));
export const admins = pgTable('admins', {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

