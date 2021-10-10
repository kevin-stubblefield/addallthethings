import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { Token } from '../../../../interfaces/httpClient';
import { IGDBAuthApi, IGDBApi } from './gamesApi';
import { GamesDB } from './gamesDAL';
import { APIGameSchema, DBGameSchema } from './schemas';

interface GameSearchRequest extends RequestGenericInterface {
  Querystring: {
    query: string;
  };
}

interface GameRetrieveRequest extends RequestGenericInterface {
  Body: {
    ids: string[];
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
  const db = new GamesDB(fastify.db);
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

      const { query } = request.query;
      const searchResults = await gamesApi.searchGames(query);

      await db.createGames(searchResults, sourceName);

      return searchResults;
    },
  });
};

export default games;
