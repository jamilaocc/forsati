import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const languageProgress = mysqlTable("language_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: varchar("lessonId", { length: 100 }).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (table) => ({
  userLessonUnique: uniqueIndex("language_progress_user_lesson_unique").on(table.userId, table.lessonId),
}));

export type LanguageProgress = typeof languageProgress.$inferSelect;

export const languageAchievements = mysqlTable("language_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  languageId: varchar("languageId", { length: 40 }).notNull(),
  score: int("score").notNull(),
  badgeId: varchar("badgeId", { length: 80 }).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (table) => ({
  userLanguageUnique: uniqueIndex("language_achievements_user_language_unique").on(table.userId, table.languageId),
}));

export type LanguageAchievement = typeof languageAchievements.$inferSelect;

export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  field: varchar("field", { length: 80 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  level: varchar("level", { length: 40 }).notNull(),
  contentLanguage: varchar("contentLanguage", { length: 40 }).notNull(),
  durationMinutes: int("durationMinutes").notNull(),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const courseLessons = mysqlTable("course_lessons", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  orderIndex: int("orderIndex").notNull(),
  durationMinutes: int("durationMinutes").notNull(),
  objectives: text("objectives").notNull(),
  prerequisites: text("prerequisites").notNull(),
  explanation: text("explanation").notNull(),
  example: text("example").notNull(),
  exercise: text("exercise").notNull(),
  questionsJson: text("questionsJson").notNull(),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  courseOrderUnique: uniqueIndex("course_lessons_course_order_unique").on(table.courseId, table.orderIndex),
}));

export type CourseLesson = typeof courseLessons.$inferSelect;
export type InsertCourseLesson = typeof courseLessons.$inferInsert;

export const courseProgress = mysqlTable("course_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (table) => ({
  userLessonUnique: uniqueIndex("course_progress_user_lesson_unique").on(table.userId, table.lessonId),
}));

export type CourseProgress = typeof courseProgress.$inferSelect;
