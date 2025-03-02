import type { Knex } from "knex";
// Always use underscores ___ snake case
export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable("users", (table) => {
    //Primary Key
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

    // User Identity
    table.string("email").notNullable().unique();
    table.string("name").notNullable();
    table.string("profile_url");

    //Authentication Info
    table.string("provider_id").notNullable();
    table
      .string("provider")
      .checkIn(["google", "github", "kustom"], "provider_name")
      .notNullable();

    /**
     * As the provider_id might be same for different providers, like google provider_id = 123, and github provider_id = 123, then provider_id.unique() alone might not be sufficient
     *
     * So we need to make the combination of provider and provider_id as unique
     */
    table.unique(["provider", "provider_id"]);

    //Indexes
    table.index("email");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}

// How this came ?
// src/db/knexfile.ts
// run from oneline-server not src
// bun knex migrate:make init -x ts --migrations-directory ./src/db/migrations
// here init is the name of the migration

// How to do DB Migration?
// bun knex migrate:latest --knexfile ./src/db/knexfile.ts
// What was the problem?
// Unknown file extension ".ts"
// Solution? Node 22 does not natively run ts directly using node index.ts
// But guess what? node 23 does!!! so I had to switch to node v23 then it worked like a charm
//No need to even change your tsconfig to module:"commonjs"
