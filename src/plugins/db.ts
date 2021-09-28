import fp from 'fastify-plugin';
import knex, { Knex } from 'knex';
const DbMigrate = require('db-migrate');

function runMigrations(): Promise<object[]> {
  return new Promise((resolve, reject) => {
    const dbMigrate = DbMigrate.getInstance(true);
    dbMigrate.silence(true);

    dbMigrate.up((error: any, results = []) => {
      if (error) {
        return reject(error);
      }

      resolve(results);
    });
  });
}

export default fp(
  async function (fastify, opts) {
    const db = knex({
      client: 'pg',
      connection: fastify.config.postgresUri,
    });

    fastify.decorate('db', db);

    const migrationResults = await runMigrations();

    if (migrationResults.length > 0) {
      fastify.log.info({
        migrationsCount: migrationResults.length,
        msg: 'Successful migrations run',
      });
    }
  },
  { name: 'db' }
);

declare module 'fastify' {
  export interface FastifyInstance {
    db: Knex<any, unknown[]>;
  }
}
