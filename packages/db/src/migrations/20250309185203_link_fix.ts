import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("links", (table) => {
    table.dropChecks("links_link_check");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("links", (table) => {
    table.check("link ~ '^https?://.+'");
  });
}
