import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  return knex.schema.createTable("shares", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("collection_id");
    table.uuid("shared_with");
    table.uuid("shared_by");
    table.enum("share_type", ["DEEP", "SHALLOW"]);

    table.timestamps(true, true);

    table.index("shared_with");
    //Relations
    table
      .foreign("shared_with")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .foreign("shared_by")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .foreign("collection_id")
      .references("id")
      .inTable("collections")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("shares");
}
