-- Additive only. Original briefs and ChatGPT ownership remain recoverable.
ALTER TABLE `experience_life_cycle_drafts` ADD COLUMN `parent_draft_id` text REFERENCES `experience_life_cycle_drafts`(`id`);
--> statement-breakpoint
ALTER TABLE `experience_life_cycle_drafts` ADD COLUMN `root_draft_id` text NOT NULL DEFAULT '';
--> statement-breakpoint
UPDATE `experience_life_cycle_drafts` SET `root_draft_id`=`id` WHERE `root_draft_id`='';
--> statement-breakpoint
CREATE INDEX `idx_life_cycle_owner_root` ON `experience_life_cycle_drafts` (`owner_id`,`root_draft_id`);
