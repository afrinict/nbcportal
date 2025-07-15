ALTER TABLE "users" RENAME COLUMN "subunit_id" TO "department";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "department_id" TO "unit";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "unit_id" TO "subunit";--> statement-breakpoint
ALTER TABLE "workflow_stages" ALTER COLUMN "department_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_stages" ADD COLUMN "required_documents" jsonb;--> statement-breakpoint
ALTER TABLE "workflow_stages" ADD COLUMN "assigned_role" text DEFAULT 'reviewer';--> statement-breakpoint
ALTER TABLE "workflow_stages" ADD COLUMN "can_reject" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "workflow_stages" ADD COLUMN "can_approve" boolean DEFAULT false;