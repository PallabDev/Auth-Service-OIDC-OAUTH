ALTER TABLE "oauth_clients" ADD COLUMN "owner_user_id" integer;

UPDATE "oauth_clients"
SET "owner_user_id" = (
    SELECT "id"
    FROM "users"
    ORDER BY "id"
    LIMIT 1
)
WHERE "owner_user_id" IS NULL;

ALTER TABLE "oauth_clients"
ALTER COLUMN "owner_user_id" SET NOT NULL;

ALTER TABLE "oauth_clients"
ADD CONSTRAINT "oauth_clients_owner_user_id_users_id_fk"
FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
