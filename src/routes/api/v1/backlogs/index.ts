import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { BacklogRequestDTO, BacklogsDB } from './backlogsDAL';
import { BacklogSchema } from './schemas';

interface BacklogRetrieveAllRequest extends RequestGenericInterface {
  Querystring: {
    userId: number;
    limit?: number;
    offset?: number;
  };
}

interface BacklogRetrieveOneRequest extends RequestGenericInterface {
  Params: {
    id: number;
  };
}

interface BacklogCreateRequest extends RequestGenericInterface {
  Body: BacklogRequestDTO;
}

type BacklogUpdateRequest = BacklogRetrieveOneRequest &
  Omit<BacklogCreateRequest, 'user_id'>;

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

  fastify.route<BacklogRetrieveAllRequest>({
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

  fastify.route<BacklogRetrieveOneRequest>({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Backlogs'],
      description: 'Retrieves a single backlog from database',
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
      },
      response: {
        200: BacklogSchema,
      },
    },
    handler: async (request, reply) => {
      return await db.getBacklog(request.params.id);
    },
  });

  fastify.route<BacklogUpdateRequest>({
    method: 'PATCH',
    url: '/:id',
    schema: {
      tags: ['Backlogs'],
      description: 'Updates a backlog in the database',
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'integer', minimum: 0 },
        },
      },
      response: {
        200: BacklogSchema,
      },
    },
    handler: async (request, reply) => {
      return await db.updateBacklog(request.params.id, request.body);
    },
  });

  fastify.route<BacklogRetrieveOneRequest>({
    method: 'DELETE',
    url: '/:id',
    schema: {
      tags: ['Backlogs'],
      description: 'Removes a single backlog from database',
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
      },
      response: {
        204: { type: 'string', default: 'No Content' },
      },
    },
    handler: async (request, reply) => {
      const backlogId = request.params.id;
      const exists = await db.backlogExists(backlogId);

      if (!exists) {
        throw { statusCode: 404, message: 'Backlog not found' };
      }

      await db.deleteBacklog(backlogId);

      reply.code(204);
    },
  });
};

export default backlogs;