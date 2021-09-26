import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import appConfig from '../../../../../config/appConfig';
import { AuthApi, IGDBApi, Token } from './gamesDAL';
import { GameSchema } from './schema';

interface GameSearchRequest extends RequestGenericInterface {
  Querystring: {
    query: string;
  };
}

interface GameRetrieveRequest extends RequestGenericInterface {
  Body: {
    ids: number[] | string[];
  };
}

const games: FastifyPluginAsync = async function (fastify, opts) {
  const clientId = appConfig.igdbClientId;
  const clientSecret = appConfig.igdbClientSecret;
  const authApi = new AuthApi('https://id.twitch.tv', clientId, clientSecret);
  const token: Token = await authApi.getToken();

  fastify.route<GameRetrieveRequest>({
    method: 'POST',
    url: '/',
    schema: {
      tags: ['Games'],
      description: 'Get one or more games by id',
      body: {
        ids: {
          type: 'array',
          items: { type: ['number', 'string'] },
        },
      },
      response: {
        200: {
          type: 'array',
          items: GameSchema,
        },
      },
    },
    handler: async (request, reply) => {
      const gamesApi = new IGDBApi('https://api.igdb.com/v4', clientId, token);

      return gamesApi.getGamesById(request.body.ids);
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
          items: GameSchema,
        },
      },
    },
    handler: async (request, reply) => {
      const gamesApi = new IGDBApi('https://api.igdb.com/v4', clientId, token);

      const { query } = request.query;
      const searchResults = await gamesApi.searchGames(query);
      return searchResults;
    },
  });
};

export default games;
