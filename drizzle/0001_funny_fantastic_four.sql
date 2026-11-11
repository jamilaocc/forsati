CREATE TABLE `language_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` varchar(100) NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `language_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `language_progress_user_lesson_unique` UNIQUE(`userId`,`lessonId`)
);
