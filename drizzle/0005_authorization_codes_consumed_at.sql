ALTER TABLE "authorization_codes"
ADD COLUMN IF NOT EXISTS "consumed_at" timestamp with time zone;
