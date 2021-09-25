import { FastifyPluginAsync } from 'fastify';
import appConfig from '../../../../../config/appConfig';
import { AuthApi, Token } from './gamesDAL';

const games: FastifyPluginAsync = async function (fastify, opts) {
  const clientId = appConfig.igdbClientId;
  const clientSecret = appConfig.igdbClientSecret;
  const authApi = new AuthApi('https://id.twitch.tv', clientId, clientSecret);

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Games'],
      description: 'Get games',
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const tokenData: Token = await authApi.getToken();
      fastify.log.info({ token: tokenData.accessToken });
      return { message: tokenData.accessToken };
    },
  });
};

export default games;
