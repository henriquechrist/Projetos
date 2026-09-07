import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const rsvps = sqliteTable('rsvps', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  attendance: text('attendance', { enum: ['yes', 'no'] }).notNull(),
  phone: text('phone'),
  companions: integer('companions').notNull().default(0),
  companionNames: text('companion_names'),
  dietaryNotes: text('dietary_notes'),
  message: text('message'),
  createdAt: text('created_at').notNull(),
}, (table) => [
  index('idx_rsvps_attendance').on(table.attendance),
  index('idx_rsvps_created_at').on(table.createdAt),
]);
