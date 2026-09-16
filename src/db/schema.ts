import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const issues = pgTable("issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  deadline: timestamp("deadline", { withTimezone: true }),
  documents: text("documents").array(),
  status: text("status").default("pending").notNull(),
  clientId: text("client_id").notNull(),
  developerId: text("developer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export const issueRemarks = pgTable("issue_remarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  issueId: uuid("issue_id").references(() => issues.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").notNull(),
  remark: text("remark").notNull(),
  documents: text("documents").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
