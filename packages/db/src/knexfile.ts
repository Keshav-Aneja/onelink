export const config = (connection: string) => {
  return {
    development: {
      client: "postgresql",
      connection: connection,
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
      connection: connection,
      pool: {
        min: 2,
        max: 10,
      },
      migrations: {
        tableName: "knex_migrations",
      },
    },
  };
};

export default config;
