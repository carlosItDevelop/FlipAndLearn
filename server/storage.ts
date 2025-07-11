import { Lesson as LessonModel, InsertLesson, lessons } from "../shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getLesson(id: number): Promise<LessonModel | undefined>;
  getAllLessons(): Promise<LessonModel[]>;
  getLessonsByLevel(level: string): Promise<LessonModel[]>;
  createLesson(lesson: InsertLesson): Promise<LessonModel>;
  updateLesson(id: number, lesson: Partial<InsertLesson>): Promise<LessonModel | undefined>;
  deleteLesson(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getLesson(id: number): Promise<LessonModel | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson || undefined;
  }

  async getAllLessons(): Promise<LessonModel[]> {
    return await db.select().from(lessons);
  }

  async getLessonsByLevel(level: string): Promise<LessonModel[]> {
    return await db.select().from(lessons).where(eq(lessons.level, level));
  }

  async createLesson(lesson: InsertLesson): Promise<LessonModel> {
    const [newLesson] = await db
      .insert(lessons)
      .values(lesson)
      .returning();
    return newLesson;
  }

  async updateLesson(id: number, lesson: Partial<InsertLesson>): Promise<LessonModel | undefined> {
    const [updatedLesson] = await db
      .update(lessons)
      .set({ ...lesson, updatedAt: new Date() })
      .where(eq(lessons.id, id))
      .returning();
    return updatedLesson || undefined;
  }

  async deleteLesson(id: number): Promise<boolean> {
    const result = await db.delete(lessons).where(eq(lessons.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();