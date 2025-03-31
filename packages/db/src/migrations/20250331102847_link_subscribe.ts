import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("links", (table) => {
    table.boolean("subscribed").nullable().defaultTo(false);
  });

  await knex.raw(`UPDATE "links" SET "subscribed" = FALSE`);

  return knex.schema.alterTable("links", (table) => {
    table.boolean("subscribed").notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("links", (table) => {
    table.dropColumn("subscribed");
  });
}
