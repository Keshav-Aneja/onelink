import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("rss_feed_cache", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid("subscription_id")
      .notNullable()
      .references("id")
      .inTable("rss_subscriptions")
      .onDelete("CASCADE");
    table
      .uuid("owner_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("item_hash").notNullable();
    table.text("title");
    table.text("link");
    table.timestamp("published_date");
    table.timestamp("fetched_at").defaultTo(knex.fn.now());

    table.unique(["subscription_id", "item_hash"]);
    table.index("owner_id");
    table.index("subscription_id");
    table.index("published_date");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("rss_feed_cache");
}
