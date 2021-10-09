import fp from 'fastify-plugin';
import knex from 'knex';
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

    fastify.decorate('db', db).addHook('onClose', async (instance, done) => {
      await db.destroy();
      done();
    });

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
