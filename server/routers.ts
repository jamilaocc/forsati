import { COOKIE_NAME } from "@shared/const";
import { getCompletedLanguageLessons, getCourseProgress, getLanguageAchievements, getPublishedCourseLibrary, saveLanguageAchievement, setCourseLessonProgress, setLanguageLessonProgress } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  languageProgress: router({
    list: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      return getCompletedLanguageLessons(ctx.user.id);
    }),
    set: publicProcedure
      .input(z.object({ lessonId: z.string().min(1).max(100), completed: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) return { persisted: false } as const;
        await setLanguageLessonProgress(ctx.user.id, input.lessonId, input.completed);
        return { persisted: true } as const;
      }),
  }),

  languageAchievements: router({
    list: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      return getLanguageAchievements(ctx.user.id);
    }),
    save: publicProcedure
      .input(z.object({ languageId: z.string().min(1).max(40), score: z.number().int().min(70).max(100), badgeId: z.string().min(1).max(80) }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) return { persisted: false } as const;
        await saveLanguageAchievement(ctx.user.id, input.languageId, input.score, input.badgeId);
        return { persisted: true } as const;
      }),
  }),

  courseCatalog: router({
    list: publicProcedure.query(async () => getPublishedCourseLibrary()),
    progress: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      return getCourseProgress(ctx.user.id);
    }),
    setProgress: publicProcedure
      .input(z.object({ lessonId: z.number().int().positive(), completed: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) return { persisted: false } as const;
        await setCourseLessonProgress(ctx.user.id, input.lessonId, input.completed);
        return { persisted: true } as const;
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
