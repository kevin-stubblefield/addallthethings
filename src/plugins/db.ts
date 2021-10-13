import fp from 'fastify-plugin';
import knex, { Knex } from 'knex';
import knexConfig from '../../knexfile';

async function runMigrations(config: Knex.Config): Promise<any> {
  return await knex(config).migrate.latest();
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

    const dbConfig =
      process.env.NODE_ENV || 'development' === 'development'
        ? knexConfig.development
        : knexConfig.production;

    const migrationResults = await runMigrations(dbConfig);

    if (migrationResults.length > 0) {
      fastify.log.info({
        migrationsCount: migrationResults.length,
        msg: 'Successful migrations run',
      });
    }
  },
  { name: 'db' }
);
