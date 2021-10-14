import fp from 'fastify-plugin';
import knex, { Knex } from 'knex';
import knexConfig from '../../knexfile';

async function runMigrations(db: Knex): Promise<any> {
  return await db.migrate.latest();
}

export default fp(
  async function (fastify, opts) {
    const dbConfig =
      process.env.NODE_ENV || 'development' === 'development'
        ? knexConfig.development
        : knexConfig.production;

    const db = knex(dbConfig);

    fastify.decorate('db', db).addHook('onClose', async (instance) => {
      await db.destroy();
    });

    const migrationResults = await runMigrations(db);

    if (migrationResults.length > 0) {
      fastify.log.info({
        migrationsCount: migrationResults.length,
        msg: 'Successful migrations run',
      });
    }
  },
  { name: 'db' }
);
