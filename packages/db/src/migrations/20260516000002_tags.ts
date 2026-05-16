import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tags", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.string("name", 40).notNullable();
    t.uuid("owner_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    t.boolean("is_auto").defaultTo(true);
    t.timestamps(true, true);
    t.unique(["name", "owner_id"]);
    t.index(["owner_id"]);
  });

  await knex.schema.createTable("link_tags", (t) => {
    t.uuid("link_id")
      .notNullable()
      .references("id")
      .inTable("links")
      .onDelete("CASCADE");
    t.uuid("tag_id")
      .notNullable()
      .references("id")
      .inTable("tags")
      .onDelete("CASCADE");
    t.boolean("confirmed").defaultTo(false);
    t.primary(["link_id", "tag_id"]);
    t.index(["tag_id"]);
    t.index(["link_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("link_tags");
  await knex.schema.dropTableIfExists("tags");
}
