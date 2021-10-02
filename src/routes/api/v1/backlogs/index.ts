import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { BacklogCategory, BacklogsDB } from './backlogsDAL';

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
          200: {
            type: 'object',
            required: ['id', 'name', 'description', 'user_id', 'category'],
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              description: { type: 'string' },
              user_id: { type: 'integer', minimum: 1 },
              category: { type: 'integer', minimum: 0 },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const newBacklog = await db.createBacklog(request.body);
      return newBacklog;
    },
  });
};

export default backlogs;
