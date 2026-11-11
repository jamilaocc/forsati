CREATE TABLE `language_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`languageId` varchar(40) NOT NULL,
	`score` int NOT NULL,
	`badgeId` varchar(80) NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `language_achievements_id` PRIMARY KEY(`id`),
	CONSTRAINT `language_achievements_user_language_unique` UNIQUE(`userId`,`languageId`)
);
