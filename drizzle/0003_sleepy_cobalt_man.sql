CREATE TABLE `course_lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(180) NOT NULL,
	`orderIndex` int NOT NULL,
	`durationMinutes` int NOT NULL,
	`objectives` text NOT NULL,
	`prerequisites` text NOT NULL,
	`explanation` text NOT NULL,
	`example` text NOT NULL,
	`exercise` text NOT NULL,
	`questionsJson` text NOT NULL,
	`published` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `course_lessons_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_lessons_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `course_lessons_course_order_unique` UNIQUE(`courseId`,`orderIndex`)
);
--> statement-breakpoint
CREATE TABLE `course_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_progress_user_lesson_unique` UNIQUE(`userId`,`lessonId`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`field` varchar(80) NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`level` varchar(40) NOT NULL,
	`contentLanguage` varchar(40) NOT NULL,
	`durationMinutes` int NOT NULL,
	`published` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_slug_unique` UNIQUE(`slug`)
);
