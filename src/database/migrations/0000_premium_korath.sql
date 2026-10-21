CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date" text NOT NULL,
	"time" text,
	"venue" text,
	"type" text NOT NULL,
	"status" text DEFAULT 'upcoming' NOT NULL,
	"registration_url" text,
	"banner_image" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"tags" text[] NOT NULL,
	"github_url" text NOT NULL,
	"demo_url" text,
	"cover_image" text,
	"author_name" text NOT NULL,
	"author_role" text NOT NULL,
	"author_github" text,
	"author_avatar" text,
	"featured" boolean DEFAULT false,
	"status" text DEFAULT 'pending' NOT NULL,
	"user_id" text,
	"user_email" text,
	"submitted_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"avatar_url" text,
	"github_handle" text,
	"role" text DEFAULT 'student' NOT NULL,
	"department" text,
	"batch" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
