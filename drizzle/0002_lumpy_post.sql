CREATE TABLE `endpoints` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`path` text NOT NULL,
	`method` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'active' NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `endpoints_user_id_idx` ON `endpoints` (`user_id`);--> statement-breakpoint
CREATE INDEX `endpoints_path_idx` ON `endpoints` (`path`);