import knex from "knex";
import config from "./src/knexfile";
import { env } from "bun";

// TODO:  in prod use dependency injection to create knex instance
// so db can be mocked for tests
const cn = process.env.PG_CONNECTION ?? "";

const knexConfig =
  process.env.NODE_ENV === "production"
    ? config(cn).production
    : config(cn).development;
const db = knex(knexConfig);
export default db;
export * as dbType from "./src/types/knex";
