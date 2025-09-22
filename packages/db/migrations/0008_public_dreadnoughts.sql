ALTER TABLE "companies" ALTER COLUMN "link" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "mothersEmail" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "mothersPhone" varchar(10);--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "fathersName" varchar(255);--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "fathersEmail" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "fathersPhone" varchar(10);--> statement-breakpoint
ALTER TABLE "companies" DROP COLUMN "email";