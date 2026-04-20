CREATE TABLE "oauth_clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_name" varchar(255) NOT NULL,
	"contact_email" varchar(255) NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"client_secret" text NOT NULL,
	"application_url" text NOT NULL,
	"redirect_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "oauth_clients_client_id_unique" UNIQUE("client_id")
);
