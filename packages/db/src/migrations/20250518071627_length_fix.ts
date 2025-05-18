import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("links", (table) => {
    table.text("name").alter();
    table.text("link").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("links", (table) => {
    table.string("name").alter();
    table.string("link").alter();
  });
}
