import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import appConfig from '../../../../../config/appConfig';
import { AuthApi, GamesApi, Token } from './gamesDAL';
import { GameSchema } from './schema';

interface GameRequest extends RequestGenericInterface {
  Querystring: {
    query: string;
  };
}

const games: FastifyPluginAsync = async function (fastify, opts) {
  const clientId = appConfig.igdbClientId;
  const clientSecret = appConfig.igdbClientSecret;
  const authApi = new AuthApi('https://id.twitch.tv', clientId, clientSecret);

  fastify.route<GameRequest>({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Games'],
      description: 'Get games',
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
      const token: Token = await authApi.getToken();
      const gamesApi = new GamesApi('https://api.igdb.com/v4', clientId, token);

      const { query } = request.query;
      const searchResults = await gamesApi.searchGames(query);
      return searchResults;
    },
  });
};

export default games;
