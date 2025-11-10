import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", { 
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  full_name: varchar("full_name").notNull(),
  email: varchar("email").notNull(),
  birth_date: date("birth_date").notNull(),
  description: varchar("short_description", { length: 500 }).notNull(),
  address: varchar("address").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const experienceTable = pgTable("experience", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  start: date("start").notNull(),
  end: date("end").notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const projectsTable = pgTable("projects", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  tite: text("title").notNull(),
  url: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const userRelations = relations(usersTable, ({ many }) => ({
  projects: many(projectsTable),
  experiences: many(experienceTable),
}));

export const experienceRelations = relations(experienceTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [experienceTable.user_id],
    references: [usersTable.id],
  }),
}));

const projectsRelations = relations(projectsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [projectsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const schema = {
    usersTable,
    projectsTable,
    experienceTable,
    experienceRelations,
    userRelations,
    projectsRelations
};