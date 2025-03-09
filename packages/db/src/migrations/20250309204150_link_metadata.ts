import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  //description, keywords, author, rss link
  return knex.schema.alterTable("links", (table) => {
    table.string("site_description").defaultTo("");
    table.string("keywords").defaultTo("");
    table.string("author").defaultTo("");
    table.string("rss").defaultTo("");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("links", (table) => {
    table.dropColumn("site_description");
    table.dropColumn("keywords");
    table.dropColumn("author");
    table.dropColumn("rss");
  });
}
