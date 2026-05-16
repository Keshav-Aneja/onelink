import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  return knex.schema.createTable("public_shares", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("token").notNullable().unique().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("collection_id").notNullable();
    table.uuid("owner_id").notNullable();
    table.enum("share_type", ["DEEP", "SHALLOW"]).notNullable().defaultTo("SHALLOW");
    table.boolean("is_active").notNullable().defaultTo(true);

    table.timestamps(true, true);

    table.index("token");
    table.index("collection_id");
    table.index("owner_id");

    table
      .foreign("collection_id")
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
  return knex.schema.dropTable("public_shares");
}
