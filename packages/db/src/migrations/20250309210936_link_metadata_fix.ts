import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("links", (table) => {
    table.text("site_description").defaultTo("").alter();
    table.text("keywords").defaultTo("").alter();
    table.text("rss").defaultTo("").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("links", (table) => {
    table.string("site_description").defaultTo("").alter();
    table.string("keywords").defaultTo("").alter();
    table.string("rss").defaultTo("").alter();
  });
}
