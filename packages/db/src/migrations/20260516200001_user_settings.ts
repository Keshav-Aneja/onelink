import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_settings", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.uuid("user_id")
      .notNullable()
      .unique()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    t.string("accent_color", 7).notNullable().defaultTo("#f63f94");
    t.string("view_mode", 10).notNullable().defaultTo("grid");
    t.integer("grid_density").notNullable().defaultTo(6);
    t.timestamps(true, true);
    t.index(["user_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("user_settings");
}
