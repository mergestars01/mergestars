CREATE TABLE `experience_house_scene_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`parent_version_id` text,
	`layout_json` text NOT NULL,
	`request_id` text NOT NULL,
	`request_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_scene_owner_created` ON `experience_house_scene_versions` (`owner_id`,`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_scene_owner_request` ON `experience_house_scene_versions` (`owner_id`,`request_id`);