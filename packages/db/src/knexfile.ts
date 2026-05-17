import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "migrations");

export const config = {
  development: {
    client: "postgresql",
    connection: process.env.PG_CONNECTION,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: migrationsDir,
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
      directory: migrationsDir,
    },
  },
};

export default config;
