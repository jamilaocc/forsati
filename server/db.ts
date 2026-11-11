import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { courseLessons, courseProgress, courses, InsertUser, languageAchievements, languageProgress, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { courseLibrarySeed } from './course-library';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getCompletedLanguageLessons(userId: number): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db.select({ lessonId: languageProgress.lessonId })
    .from(languageProgress)
    .where(eq(languageProgress.userId, userId));

  return rows.map((row) => row.lessonId);
}

export async function setLanguageLessonProgress(userId: number, lessonId: string, completed: boolean): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  if (completed) {
    await db.insert(languageProgress).values({ userId, lessonId }).onDuplicateKeyUpdate({
      set: { completedAt: new Date() },
    });
    return;
  }

  await db.delete(languageProgress).where(and(
    eq(languageProgress.userId, userId),
    eq(languageProgress.lessonId, lessonId),
  ));
}

export async function getLanguageAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ languageId: languageAchievements.languageId, score: languageAchievements.score, badgeId: languageAchievements.badgeId, completedAt: languageAchievements.completedAt })
    .from(languageAchievements)
    .where(eq(languageAchievements.userId, userId));
}

export async function saveLanguageAchievement(userId: number, languageId: string, score: number, badgeId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(languageAchievements).values({ userId, languageId, score, badgeId }).onDuplicateKeyUpdate({
    set: { score, badgeId, completedAt: new Date() },
  });
}

async function ensureCourseLibrary() {
  const db = await getDb();
  if (!db) return;

  for (const seed of courseLibrarySeed) {
    const existing = await db.select().from(courses).where(eq(courses.slug, seed.slug)).limit(1);
    let course = existing[0];
    if (!course) {
      const inserted = await db.insert(courses).values({
        slug: seed.slug,
        field: seed.field,
        title: seed.title,
        description: seed.description,
        level: seed.level,
        contentLanguage: seed.contentLanguage,
        durationMinutes: seed.durationMinutes,
        published: seed.published,
      });
      const courseId = Number(inserted[0].insertId);
      const created = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
      course = created[0];
    }

    if (!course) continue;
    await db.update(courses).set({
      field: seed.field,
      title: seed.title,
      description: seed.description,
      level: seed.level,
      contentLanguage: seed.contentLanguage,
      durationMinutes: seed.durationMinutes,
      published: seed.published,
    }).where(eq(courses.id, course.id));
    const existingLessons = await db.select({ slug: courseLessons.slug }).from(courseLessons).where(eq(courseLessons.courseId, course.id));
    const existingSlugs = new Set(existingLessons.map((item) => item.slug));
    const missingLessons = seed.lessons
      .filter((item) => !existingSlugs.has(item.slug))
      .map((lesson) => ({ ...lesson, courseId: course!.id, published: true }));
    if (missingLessons.length > 0) {
      await db.insert(courseLessons).values(missingLessons);
    }
    await db.update(courseLessons).set({ published: true }).where(eq(courseLessons.courseId, course.id));
  }
}

function parseQuestions(questionsJson: string) {
  try {
    return JSON.parse(questionsJson) as Array<{ question: string; options: string[]; answer: number; explanation: string }>;
  } catch {
    return [];
  }
}

export async function getPublishedCourseLibrary() {
  const db = await getDb();
  if (!db) return [];
  await ensureCourseLibrary();
  const publishedCourses = await db.select().from(courses).where(eq(courses.published, true));
  const library = [];
  for (const course of publishedCourses) {
    const lessons = await db.select().from(courseLessons)
      .where(and(eq(courseLessons.courseId, course.id), eq(courseLessons.published, true)))
      .orderBy(asc(courseLessons.orderIndex));
    library.push({
      ...course,
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        orderIndex: lesson.orderIndex,
        durationMinutes: lesson.durationMinutes,
        objectives: lesson.objectives,
        prerequisites: lesson.prerequisites,
        explanation: lesson.explanation,
        example: lesson.example,
        exercise: lesson.exercise,
        questions: parseQuestions(lesson.questionsJson),
      })),
    });
  }
  return library;
}

export async function getCourseProgress(userId: number): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ lessonId: courseProgress.lessonId })
    .from(courseProgress)
    .where(eq(courseProgress.userId, userId));
  return rows.map((row) => row.lessonId);
}

export async function setCourseLessonProgress(userId: number, lessonId: number, completed: boolean): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  if (completed) {
    await db.insert(courseProgress).values({ userId, lessonId }).onDuplicateKeyUpdate({ set: { completedAt: new Date() } });
    return;
  }
  await db.delete(courseProgress).where(and(eq(courseProgress.userId, userId), eq(courseProgress.lessonId, lessonId)));
}
