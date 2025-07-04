ALTER TABLE "applications" RENAME COLUMN "job_id" TO "jobId";--> statement-breakpoint
ALTER TABLE "applications" RENAME COLUMN "student_id" TO "studentId";--> statement-breakpoint
ALTER TABLE "applications" RENAME COLUMN "resume_id" TO "resumeId";--> statement-breakpoint
ALTER TABLE "grades" RENAME COLUMN "student_id" TO "studentId";--> statement-breakpoint
ALTER TABLE "internships" RENAME COLUMN "student_id" TO "studentId";--> statement-breakpoint
ALTER TABLE "jobs" RENAME COLUMN "company_id" TO "companyId";--> statement-breakpoint
ALTER TABLE "resumes" RENAME COLUMN "student_id" TO "studentId";--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_job_id_jobs_id_fk";
--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_resume_id_resumes_id_fk";
--> statement-breakpoint
ALTER TABLE "grades" DROP CONSTRAINT "grades_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "internships" DROP CONSTRAINT "internships_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "resumes" DROP CONSTRAINT "resumes_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "grades" DROP CONSTRAINT "grades_student_id_sem_pk";--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_studentId_sem_pk" PRIMARY KEY("studentId","sem");--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobId_jobs_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_studentId_students_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_resumeId_resumes_id_fk" FOREIGN KEY ("resumeId") REFERENCES "public"."resumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_studentId_students_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internships" ADD CONSTRAINT "internships_studentId_students_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_studentId_students_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;