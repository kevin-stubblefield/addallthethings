import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { services } from '../../../../services';
import { IGDBAuthApi, IGDBApi } from '../../../../http';
import { APIGameSchema, DBGameSchema } from './schemas';
import { Token } from '../../../../http/base.http';

interface GameSearchRequest extends RequestGenericInterface {
  Querystring: {
    query: string;
    limit: number;
    offset: number;
  };
}

interface GameRetrieveRequest extends RequestGenericInterface {
  Body: {
    ids: string[];
  };
}

interface DBGameRetrieveOneRequest extends RequestGenericInterface {
  Params: {
    game_id: string;
  };
}

const games: FastifyPluginAsync = async function (fastify, opts) {
  const clientId = fastify.config.igdbClientId;
  const clientSecret = fastify.config.igdbClientSecret;
  const authApi = new IGDBAuthApi(
    'https://id.twitch.tv',
    clientId,
    clientSecret
  );
  const token: Token = await authApi.getToken();
  const db = services(fastify.db).gameDBService;
  const sourceName = 'IGDB';

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Games'],
      description: 'Get games from db',
      response: {
        200: { type: 'array', items: DBGameSchema },
      },
    },
    handler: async (request, reply) => {
      return await db.getGames();
    },
  });

  fastify.route<DBGameRetrieveOneRequest>({
    method: 'GET',
    url: '/:game_id',
    schema: {
      tags: ['Games'],
      description: 'Get a game from db by API id',
      params: {
        type: 'object',
        properties: {
          game_id: { type: 'string' },
        },
      },
      response: {
        200: DBGameSchema,
      },
    },
    handler: async (request, reply) => {
      const { game_id } = request.params;
      return await db.getGameByApiId(game_id);
    },
  });

  fastify.route<GameRetrieveRequest>({
    method: 'POST',
    url: '/',
    schema: {
      tags: ['Games'],
      description: 'Get one or more games by id',
      body: {
        type: 'object',
        required: ['ids'],
        properties: {
          ids: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
          },
        },
      },
      response: {
        200: {
          type: 'array',
          items: APIGameSchema,
        },
      },
    },
    handler: async (request, reply) => {
      const gamesApi = new IGDBApi('https://api.igdb.com/v4', clientId, token);
      const games = await gamesApi.getGamesById(request.body.ids);

      await db.createGames(games, sourceName);

      return games;
    },
  });

  fastify.route<GameSearchRequest>({
    method: 'GET',
    url: '/search',
    schema: {
      tags: ['Games'],
      description: 'Search for games',
      querystring: {
        query: { type: 'string' },
        limit: { type: 'integer' },
        offset: { type: 'integer' },
      },
      response: {
        200: {
          type: 'array',
          items: APIGameSchema,
        },
      },
    },
    handler: async (request, reply) => {
      const gamesApi = new IGDBApi('https://api.igdb.com/v4', clientId, token);

      const { query, limit, offset } = request.query;
      const searchResults = await gamesApi.searchGames(
        query.replaceAll('+', ' '),
        limit,
        offset
      );

      await db.createGames(searchResults, sourceName);

      return searchResults;
    },
  });
};

export default games;
