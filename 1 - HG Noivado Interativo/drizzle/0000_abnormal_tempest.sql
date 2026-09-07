CREATE TABLE `rsvps` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`attendance` text NOT NULL,
	`phone` text,
	`companions` integer DEFAULT 0 NOT NULL,
	`companion_names` text,
	`dietary_notes` text,
	`message` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rsvps_attendance` ON `rsvps` (`attendance`);--> statement-breakpoint
CREATE INDEX `idx_rsvps_created_at` ON `rsvps` (`created_at`);
--> statement-breakpoint
PRAGMA optimize;
