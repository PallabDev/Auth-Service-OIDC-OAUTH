CREATE TABLE "authorization_codes" (
	"code" text PRIMARY KEY NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"redirect_uri" text NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "authorization_codes"
ADD CONSTRAINT "authorization_codes_user_id_users_id_fk"
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "authorization_codes_expires_at_idx" ON "authorization_codes" ("expires_at");
