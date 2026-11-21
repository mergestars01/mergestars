CREATE TABLE `experience_life_cycle_drafts` (
  `id` text PRIMARY KEY NOT NULL,
  `owner_id` text NOT NULL,
  `cycle_id` text NOT NULL,
  `line` text NOT NULL,
  `brief` text NOT NULL,
  `request_id` text NOT NULL,
  `request_hash` text NOT NULL,
  `created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_life_cycle_owner_request` ON `experience_life_cycle_drafts` (`owner_id`,`request_id`);
--> statement-breakpoint
CREATE INDEX `idx_life_cycle_owner_created` ON `experience_life_cycle_drafts` (`owner_id`,`created_at`);
--> statement-breakpoint
CREATE INDEX `idx_life_cycle_owner_slot` ON `experience_life_cycle_drafts` (`owner_id`,`cycle_id`,`line`);
--> statement-breakpoint
CREATE TABLE `experience_life_cycle_events` (
  `id` text PRIMARY KEY NOT NULL,
  `draft_id` text NOT NULL,
  `owner_id` text NOT NULL,
  `event` text NOT NULL,
  `created_at` text NOT NULL,
  FOREIGN KEY (`draft_id`) REFERENCES `experience_life_cycle_drafts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_life_cycle_events_owner_created` ON `experience_life_cycle_events` (`owner_id`,`created_at`);