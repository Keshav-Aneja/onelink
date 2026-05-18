import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw("CREATE EXTENSION IF NOT EXISTS pg_trgm");

  // Generated tsvector column — weighted by field importance:
  // A = name, B = description, C = site_description, D = keywords
  await knex.raw(`
    ALTER TABLE links
    ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(site_description, '')), 'C') ||
      setweight(to_tsvector('english', coalesce(keywords, '')), 'D')
    ) STORED
  `);

  await knex.raw(
    "CREATE INDEX links_search_vector_idx ON links USING GIN (search_vector)"
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("DROP INDEX IF EXISTS links_search_vector_idx");
  await knex.raw("ALTER TABLE links DROP COLUMN IF EXISTS search_vector");
}
