ALTER TABLE "fastform_forms" DROP COLUMN IF EXISTS "url";--> statement-breakpoint
ALTER TABLE "fastform_forms" ADD CONSTRAINT "fastform_forms_name_unique" UNIQUE("name");