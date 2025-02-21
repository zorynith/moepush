ALTER TABLE `channels` RENAME COLUMN "corpId" TO "corp_id";--> statement-breakpoint
ALTER TABLE `channels` RENAME COLUMN "agentId" TO "agent_id";--> statement-breakpoint
ALTER TABLE `channels` ADD `bot_token` text;--> statement-breakpoint
ALTER TABLE `channels` ADD `chat_id` text;