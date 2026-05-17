import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("user_settings", (t) => {
    t.boolean("show_og_image").notNullable().defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("user_settings", (t) => {
    t.dropColumn("show_og_image");
  });
}
