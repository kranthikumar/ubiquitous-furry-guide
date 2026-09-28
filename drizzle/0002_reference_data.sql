-- One-time data migration: moves the category list, the guest user and the
-- sidebar's followed channels (previously hard-coded) into the database.
-- Idempotent, and a no-op for rows whose channels don't exist yet (a fresh
-- database gets them from the seed instead).

INSERT INTO "categories" ("slug", "label", "position") VALUES
  ('fursuits', 'Fursuits', 1),
  ('art-animation', 'Art & Animation', 2),
  ('vlogs', 'Vlogs', 3),
  ('gaming', 'Gaming', 4),
  ('music', 'Music', 5),
  ('tutorials', 'Tutorials', 6),
  ('species', 'Species Focus', 7),
  ('conventions', 'Conventions', 8),
  ('interviews', 'Interviews', 9)
ON CONFLICT ("slug") DO NOTHING;
--> statement-breakpoint
INSERT INTO "channels" ("id", "name", "subscribers", "avatar") VALUES (
  'you',
  'You',
  0,
  '{"species":"husky","fur":"#7d8594","belly":"#f4f5f7","eyes":"#5aa6e0","shirt":"#1f2a44","bg":"#e3e8f0"}'::jsonb
)
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "followed_channels" ("channel_id", "position")
SELECT c."id", f."position"
FROM (VALUES
  ('anthroarts', 1),
  ('fuzzbuttvlogs', 2),
  ('pawprintanims', 3),
  ('wuffgaming', 4),
  ('artbysparky', 5),
  ('gamerhyena', 6),
  ('dancepaws', 7)
) AS f("channel_id", "position")
JOIN "channels" c ON c."id" = f."channel_id"
ON CONFLICT ("channel_id") DO NOTHING;
