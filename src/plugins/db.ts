import fp from 'fastify-plugin';
import { Pool } from 'pg';
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

module.exports = fp(
  async function (fastify, opts) {
    const dbPool = new Pool({
      connectionString: fastify.config.postgresUri,
    });

    fastify
      .decorate('db', dbPool)
      .addHook('onClose', async (instance, done) => {
        await dbPool.end();
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
