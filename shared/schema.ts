import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  level: varchar('level', { length: 20 }).notNull(),
  englishText: text('english_text').notNull(),
  portugueseText: text('portuguese_text').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;