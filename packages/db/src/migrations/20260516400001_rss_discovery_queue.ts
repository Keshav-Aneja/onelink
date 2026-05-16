import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("rss_discovery_queue", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("link_id").notNullable().references("id").inTable("links").onDelete("CASCADE");
    table.uuid("owner_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("processed_at").nullable();

    table.index("owner_id");
    table.index("created_at");
    table.index("processed_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("rss_discovery_queue");
}
