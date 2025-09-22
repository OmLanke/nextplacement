ALTER TABLE "jobs" ADD COLUMN "fileType" varchar(10);--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "fileUrl" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "fileName" text;