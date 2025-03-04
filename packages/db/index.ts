import knex from "knex";
import config from "./src/knexfile";

// TODO:  in prod use dependency injection to create knex instance
// so db can be mocked for tests

const knexConfig =
  process.env.NODE_ENV === "production"
    ? config.production
    : config.development;
const db = knex(knexConfig);
export default db;
