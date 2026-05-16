import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("rss_read_items", (table) => {
    table.uuid("owner_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.text("item_hash").notNullable();
    table.timestamp("read_at").defaultTo(knex.fn.now());
    table.primary(["owner_id", "item_hash"]);
    table.index("owner_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("rss_read_items");
}
