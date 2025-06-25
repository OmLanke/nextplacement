ALTER TABLE "grades" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_student_id_sem_pk" PRIMARY KEY("student_id","sem");--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "sem_check1" CHECK ("grades"."sem" < 9);