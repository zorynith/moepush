ALTER TABLE `endpoints` RENAME COLUMN "description" TO "remark";--> statement-breakpoint
DROP INDEX `endpoints_path_idx`;--> statement-breakpoint
ALTER TABLE `endpoints` ADD `channel_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `endpoints` ADD `rule` text NOT NULL;--> statement-breakpoint
CREATE INDEX `endpoints_channel_id_idx` ON `endpoints` (`channel_id`);--> statement-breakpoint
ALTER TABLE `endpoints` DROP COLUMN `path`;--> statement-breakpoint
ALTER TABLE `endpoints` DROP COLUMN `method`;