import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { BacklogCategory, BacklogsDB } from './backlogsDAL';
import { BacklogSchema } from './schemas';

interface BacklogRetrieveRequest extends RequestGenericInterface {
  Querystring: {
    userId: number;
    limit?: number;
    offset?: number;
  };
}

interface BacklogCreateRequest extends RequestGenericInterface {
  Body: {
    name: string;
    description: string;
    user_id: number;
    category: BacklogCategory;
  };
}

const backlogs: FastifyPluginAsync = async function (fastify, opts) {
  const db = new BacklogsDB(fastify.db);

  fastify.route<BacklogCreateRequest>({
    method: 'POST',
    url: '/',
    schema: {
      tags: ['Backlogs'],
      description: 'Create backlog',
      body: {
        type: 'object',
        required: ['user_id'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          user_id: { type: 'integer', minimum: 1 },
          category: { type: 'integer', minimum: 0 },
        },
        response: {
          200: BacklogSchema,
        },
      },
    },
    handler: async (request, reply) => {
      const newBacklog = await db.createBacklog(request.body);
      return newBacklog;
    },
  });

  fastify.route<BacklogRetrieveRequest>({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Backlogs'],
      description: 'Retrieves list of backlogs from database',
      querystring: {
        userId: { type: 'integer' },
        limit: { type: 'integer' },
        offset: { type: 'integer' },
      },
      response: {
        200: {
          type: 'array',
          items: BacklogSchema,
        },
      },
    },
    handler: async (request, reply) => {
      const { userId } = request.query;
      const limit = request.query.limit || 15;
      const offset = request.query.offset || 0;

      return await db.getBacklogs(userId, limit, offset);
    },
  });
};

export default backlogs;
