import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table) => {
    table.dropUnique(["email"]);
    table.unique(["provider", "email"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table) => {
    table.dropUnique(["provider", "email"]);
    table.unique(["email"]);
  });
}
