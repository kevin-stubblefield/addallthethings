import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { BacklogDB } from '../../../../models/backlog.model';
import { EntryDB, EntryStatus } from '../../../../models/entry.model';
import { services } from '../../../../services';
import { BacklogEntrySchema, BacklogSchema } from './schemas';

interface BacklogRetrieveWithUserIdRequest extends RequestGenericInterface {
  Querystring: {
    user_id: number;
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
  Body: BacklogDB;
}

interface BacklogEntryCreateRequest extends RequestGenericInterface {
  Body: {
    media_id: number;
    status: EntryStatus;
  };
  Params: {
    backlog_id: number;
  };
}

interface BacklogEntryRetrieveRequest extends RequestGenericInterface {
  Params: {
    backlog_id: number;
  };
}

interface BacklogEntryUpdateRequest extends RequestGenericInterface {
  Body: {
    status: EntryStatus;
  };
  Params: {
    id: number;
  };
}

interface BacklogEntryDeleteRequest extends RequestGenericInterface {
  Params: {
    id: number;
  };
}

type BacklogUpdateRequest = BacklogRetrieveOneRequest &
  Omit<BacklogCreateRequest, 'user_id'>;

const backlogs: FastifyPluginAsync = async function (fastify, opts) {
  const dbServices = services(fastify.db);
  const backlogsDb = dbServices.backlogService;
  const entriesDb = dbServices.entryService;

  fastify.route<BacklogCreateRequest>({
    method: 'POST',
    url: '/',
    schema: {
      tags: ['Backlogs'],
      description: 'Create backlog',
      body: {
        type: 'object',
        oneOf: [
          {
            required: ['user_id'],
          },
          {
            required: ['discord_user_id'],
          },
        ],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          user_id: { type: 'integer', minimum: 1 },
          category: {
            type: 'string',
            enum: ['any', 'game', 'tv show', 'movie', 'anime'],
          },
        },
        response: {
          201: BacklogSchema,
        },
      },
    },
    handler: async (request, reply) => {
      const newBacklog = await backlogsDb.createBacklog(request.body);

      reply.statusCode = 201;
      return newBacklog;
    },
  });

  fastify.route<BacklogRetrieveWithUserIdRequest>({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Backlogs'],
      description: 'Retrieves list of backlogs from database',
      querystring: {
        user_id: { type: 'integer' },
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
      const { user_id } = request.query;
      const limit = request.query.limit || 15;
      const offset = request.query.offset || 0;

      return await backlogsDb.getBacklogs(user_id, limit, offset);
    },
  });

  fastify.route<BacklogRetrieveWithUserIdRequest>({
    method: 'GET',
    url: '/selected',
    schema: {
      tags: ['Backlogs'],
      description: 'Retrieves list of backlogs from database',
      querystring: {
        user_id: { type: 'integer' },
        limit: { type: 'integer' },
        offset: { type: 'integer' },
      },
      response: {
        200: BacklogSchema,
      },
    },
    handler: async (request, reply) => {
      const { user_id } = request.query;

      return await backlogsDb.getSelectedBacklog(user_id);
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
      const backlog = await backlogsDb.getBacklog(request.params.id);
      if (backlog.id) {
        backlog.entries = await entriesDb.getBacklogEntries(backlog.id);
      }
      return backlog;
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
          id: { type: 'integer', minimum: 1 },
        },
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          category: {
            type: 'string',
            enum: ['any', 'game', 'tv show', 'movie', 'anime'],
          },
        },
      },
      response: {
        200: BacklogSchema,
      },
    },
    handler: async (request, reply) => {
      return await backlogsDb.updateBacklog(request.params.id, request.body);
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

      await backlogsDb.deleteBacklog(backlogId);

      reply.code(204);
    },
  });

  // Backlog Entry routes

  fastify.route<BacklogEntryCreateRequest>({
    method: 'POST',
    url: '/:backlog_id/entries',
    schema: {
      tags: ['Backlog Entries'],
      description: 'Create an entry in a backlog',
      body: {
        type: 'object',
        properties: {
          media_id: { type: 'integer' },
          status: {
            type: 'string',
            enum: ['not_started', 'in_progress', 'completed'],
          },
        },
      },
      params: {
        type: 'object',
        properties: {
          backlog_id: { type: 'integer' },
        },
      },
      response: {
        201: BacklogEntrySchema,
      },
    },
    handler: async (request, reply) => {
      const newEntry: EntryDB = {
        backlog_id: request.params.backlog_id,
        ...request.body,
      };
      let result: EntryDB;

      try {
        result = await entriesDb.createBacklogEntry(newEntry);
      } catch (err) {
        throw {
          statusCode: 404,
          message: 'Media not found',
          errorMessage: `${err}`,
          internalError: err,
        };
      }

      reply.statusCode = 201;
      return result;
    },
  });

  fastify.route<BacklogEntryRetrieveRequest>({
    method: 'GET',
    url: '/:backlog_id/entries',
    schema: {
      tags: ['Backlog Entries'],
      description: 'Retrieve all entries for a backlog in the database',
      params: {
        type: 'object',
        properties: {
          backlog_id: { type: 'integer' },
        },
      },
      response: {
        200: {
          type: 'array',
          items: BacklogEntrySchema,
        },
      },
    },
    handler: async (request, reply) => {
      const { backlog_id } = request.params;
      const exists = await backlogsDb.backlogExists(backlog_id);

      if (!exists) {
        throw { statusCode: 404, message: 'Backlog not found' };
      }

      return await entriesDb.getBacklogEntries(backlog_id);
    },
  });

  fastify.route<BacklogEntryUpdateRequest>({
    method: 'PATCH',
    url: '/entries/:id',
    schema: {
      tags: ['Backlog Entries'],
      description: 'Update an entry in a backlog',
      body: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['not_started', 'in_progress', 'completed'],
          },
        },
      },
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
      },
    },
    handler: async (request, reply) => {
      let result: EntryDB;

      result = await entriesDb.updateBacklogEntry(
        request.params.id,
        request.body.status
      );

      return result;
    },
  });

  fastify.route<BacklogEntryDeleteRequest>({
    method: 'DELETE',
    url: '/entries/:id',
    schema: {
      tags: ['Backlog Entries'],
      description: 'Removes a single backlog entry from database',
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
      const entryId = request.params.id;

      await entriesDb.deleteBacklogEntry(entryId);

      reply.code(204);
    },
  });
};

export default backlogs;
