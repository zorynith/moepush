CREATE TABLE `channels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`webhook` text NOT NULL,
	`secret` text,
	`remark` text,
	`status` text DEFAULT 'active' NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `channels_user_id_idx` ON `channels` (`user_id`);