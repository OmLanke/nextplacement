DROP TABLE "certificates" CASCADE;--> statement-breakpoint
DROP TABLE "projects" CASCADE;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "isDiploma" boolean;--> statement-breakpoint
ALTER TABLE "companies" DROP COLUMN "passwordHash";--> statement-breakpoint
ALTER TABLE "internships" DROP COLUMN "status";