// This file contains code that we reuse between our tests.
import Fastify from 'fastify';
import fp from 'fastify-plugin';
import App from '../src/app';

const clearDatabaseSql = `DELETE FROM backlog_entries;
  DELETE FROM media;
  DELETE FROM media_types;
  DELETE FROM backlogs;
  DELETE FROM users;`;

export function build() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'silent',
    },
    pluginTimeout: 2 * 60 * 1000,
  });

  beforeAll(async () => {
    app.register(fp(App));
    await app.ready();
    await app.db.raw(clearDatabaseSql);
  });

  beforeEach(async () => {
    await app.db.raw(clearDatabaseSql);
  });

  afterEach(async () => {
    await app.db.raw(clearDatabaseSql);
  });

  afterAll(async () => {
    await app.close();
  });

  return app;
}
