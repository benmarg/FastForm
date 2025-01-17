// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { FormConfig } from "@/types/form";
import { sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `fastform_${name}`);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
};

export const forms = createTable("forms", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  title: varchar("title").notNull(),
  fields: jsonb("fields").$type<FormConfig["fields"]>().notNull(),
  ...timestamps,
});
