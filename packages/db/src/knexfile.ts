export const config = {
  development: {
    client: "postgresql",
    connection:
      process.env.PG_CONNECTION ??
      "postgresql://test_owner:CBak9cH2bZuR@ep-morning-sun-a5urcsx3-pooler.us-east-2.aws.neon.tech/kustom?sslmode=require",
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  production: {
    client: "postgresql",
    connection: process.env.PG_CONNECTION ?? "",
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
