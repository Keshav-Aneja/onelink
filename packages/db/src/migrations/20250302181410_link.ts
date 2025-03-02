import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable("links", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name");
    table.text("description");
    table.string("fingerprint").unique();
    table.string("link").notNullable().checkRegex("^https?://.+");
    table.string("open_graph");

    table.uuid("owner_id").notNullable();
    table.uuid("parent_id").nullable();

    table.timestamps(true, true);

    //Indexes
    table.index(["owner_id", "parent_id"]);
    table
      .foreign("parent_id")
      .references("id")
      .inTable("collections")
      .onDelete("CASCADE");

    table
      .foreign("owner_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("links");
}
