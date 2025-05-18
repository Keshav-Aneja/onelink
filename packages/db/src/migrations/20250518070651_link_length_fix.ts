import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.raw(`ALTER TABLE links ALTER COLUMN open_graph TYPE TEXT`);
}

export async function down(knex: Knex): Promise<void> {
  return await knex.raw(
    `ALTER TABLE links ALTER COLUMN open_graph TYPE VARCHAR(255)`,
  );
}
