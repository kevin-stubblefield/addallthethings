// This file contains code that we reuse between our tests.
import Fastify, { FastifyInstance, LightMyRequestResponse } from 'fastify';
import fp from 'fastify-plugin';
import App from '../src/app';

const clearDatabaseSql = `DELETE FROM backlog_entries;
  DELETE FROM backlogs;
  DELETE FROM users WHERE discord_username LIKE '%test%';`;

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

export async function createTestUser(
  app: FastifyInstance
): Promise<LightMyRequestResponse> {
  const userPayload = {
    discord_username: 'test_username',
    discord_discriminator: '1234',
    discord_tag: 'test_username#1234',
    discord_user_id: '1235468436206186564',
  };

  return await app.inject({
    url: '/api/v1/users',
    method: 'POST',
    payload: userPayload,
  });
}

export async function createTestBacklog(
  app: FastifyInstance,
  user: LightMyRequestResponse
): Promise<LightMyRequestResponse> {
  const createPayload = {
    name: 'Test Backlog',
    description: 'Test description',
    user_id: user.json().id,
    category: 'any',
  };

  return await app.inject({
    url: '/api/v1/backlogs',
    method: 'POST',
    payload: createPayload,
  });
}

export async function createTestBacklogEntry(
  app: FastifyInstance,
  backlog: LightMyRequestResponse,
  mediaId: number
): Promise<LightMyRequestResponse> {
  const createPayload = {
    media_id: mediaId,
    status: 'not_started',
  };

  return await app.inject({
    url: `/api/v1/backlogs/${backlog.json().id}/entries`,
    method: 'POST',
    payload: createPayload,
  });
}

export async function getGames(
  app: FastifyInstance
): Promise<LightMyRequestResponse> {
  return await app.inject({
    url: '/api/v1/games',
    method: 'GET',
  });
}

export async function createTestGames(
  app: FastifyInstance
): Promise<LightMyRequestResponse> {
  const mediaPayload = {
    ids: [114283, 144051, 19614, 119257, 146112, 6706, 45165],
  };

  return await app.inject({
    url: '/api/v1/games',
    method: 'POST',
    payload: mediaPayload,
  });
}
