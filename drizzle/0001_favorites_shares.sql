CREATE TABLE "favorite_exercise" (
	"user_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routine_share" (
	"token" text PRIMARY KEY NOT NULL,
	"routine_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "favorite_exercise" ADD CONSTRAINT "favorite_exercise_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_share" ADD CONSTRAINT "routine_share_routine_id_routine_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."routine"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_share" ADD CONSTRAINT "routine_share_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "favorite_user_ex_idx" ON "favorite_exercise" USING btree ("user_id","exercise_id");--> statement-breakpoint
CREATE INDEX "routine_share_routine_idx" ON "routine_share" USING btree ("routine_id");