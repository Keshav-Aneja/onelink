import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("user_settings", (t) => {
    t.boolean("show_collection_tree").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("user_settings", (t) => {
    t.dropColumn("show_collection_tree");
  });
}
