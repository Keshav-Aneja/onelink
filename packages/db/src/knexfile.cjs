/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

/** @type {import("knex").Knex.Config} */
const config = {
  development: {
    client: "postgresql",
    connection: process.env.PG_CONNECTION,
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      loadExtensions: [".ts"],
    },
  },
  production: {
    client: "postgresql",
    connection: process.env.PG_CONNECTION ?? "",
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      loadExtensions: [".ts"],
    },
  },
};

module.exports = config;
