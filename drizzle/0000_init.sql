CREATE TABLE "channels" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subscribers" integer DEFAULT 0 NOT NULL,
	"avatar" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "channels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" text NOT NULL,
	"author_id" text NOT NULL,
	"body" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "videos" (
	"id" text PRIMARY KEY NOT NULL,
	"channel_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"views" bigint DEFAULT 0 NOT NULL,
	"duration_seconds" integer NOT NULL,
	"categories" text[] DEFAULT '{}'::text[] NOT NULL,
	"thumbnail_art" jsonb,
	"thumbnail_url" text,
	"video_url" text,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "videos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_channels_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_video_id_idx" ON "comments" USING btree ("video_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "videos_channel_id_idx" ON "videos" USING btree ("channel_id");--> statement-breakpoint
CREATE INDEX "videos_published_at_idx" ON "videos" USING btree ("published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "videos_categories_idx" ON "videos" USING gin ("categories");