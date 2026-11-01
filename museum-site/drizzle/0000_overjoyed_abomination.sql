CREATE TABLE `experience_design_drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`root_reference_id` text NOT NULL,
	`source_reference_id` text NOT NULL,
	`parent_draft_id` text,
	`name` text NOT NULL,
	`config_json` text NOT NULL,
	`request_id` text NOT NULL,
	`request_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_experience_drafts_owner_created` ON `experience_design_drafts` (`owner_id`,`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_experience_drafts_owner_request` ON `experience_design_drafts` (`owner_id`,`request_id`);--> statement-breakpoint
CREATE TABLE `experience_draft_events` (
	`id` text PRIMARY KEY NOT NULL,
	`draft_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`event` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`draft_id`) REFERENCES `experience_design_drafts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_experience_events_owner_created` ON `experience_draft_events` (`owner_id`,`created_at`);