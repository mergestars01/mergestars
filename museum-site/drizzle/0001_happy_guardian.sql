CREATE TABLE `experience_atelier_briefs` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`intent_json` text NOT NULL,
	`request_id` text NOT NULL,
	`request_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_atelier_owner_created` ON `experience_atelier_briefs` (`owner_id`,`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_atelier_owner_request` ON `experience_atelier_briefs` (`owner_id`,`request_id`);