const { env } = process;

export default {
  development: {
    client: 'pg',
    connection: env.POSTGRES_URI,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'knex/migrations',
    },
    seeds: {
      directory: 'knex/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: env.POSTGRES_URI,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'knex/migrations',
    },
    seeds: {
      directory: 'knex/seeds',
    },
  },
};
