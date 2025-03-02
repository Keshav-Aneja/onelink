import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable("collections", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name", 100).notNullable();
    table.string("color", 9); //Hex format
    table.text("description");

    table.boolean("is_protected").defaultTo(false);
    table.string("password");

    //The top level directory would be root or we can call it like Keshav's links
    table.uuid("parent_id").nullable();
    table.uuid("owner_id").notNullable();

    table.timestamps(true, true);

    /**
     * A user must not have the two directory with the same name in a single directory. They can have same named directory in different directories
     */
    table.unique(["parent_id", "owner_id", "name"]);

    //Indexes
    table.index("parent_id");
    table.index("owner_id");

    // Relations & References
    table
      .foreign("owner_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .foreign("parent_id")
      .references("id")
      .inTable("collections")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("collections");
}
