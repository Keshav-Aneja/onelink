import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("rss_subscriptions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("owner_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.text("feed_url").notNullable();
    table.text("site_url");
    table.text("title");
    table.text("favicon_url");
    table.uuid("link_id").nullable().references("id").inTable("links").onDelete("SET NULL");
    table.timestamp("last_fetched_at").nullable();
    table.text("last_error").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["owner_id", "feed_url"]);
    table.index("owner_id");
  });

  // Back-fill from existing subscribed links
  await knex.raw(`
    INSERT INTO rss_subscriptions (id, owner_id, feed_url, site_url, link_id, created_at)
    SELECT
      uuid_generate_v4(),
      owner_id,
      rss,
      link,
      id,
      created_at
    FROM links
    WHERE subscribed = TRUE AND rss IS NOT NULL AND rss != ''
    ON CONFLICT (owner_id, feed_url) DO NOTHING
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("rss_subscriptions");
}
