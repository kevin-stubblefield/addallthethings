import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { UserSchema } from './schemas';
import { UsersDB } from './usersDAL';

interface UserRetrieveByDiscordIdRequest extends RequestGenericInterface {
  Params: {
    discordId: string;
  };
}

const users: FastifyPluginAsync = async function (fastify, opts) {
  const db = new UsersDB(fastify.db);

  fastify.route<UserRetrieveByDiscordIdRequest>({
    method: 'GET',
    url: '/:discordId',
    schema: {
      tags: ['Users'],
      description: 'Retrieve a user from the database by their discord id',
      params: {
        type: 'object',
        properties: {
          discordId: { type: 'string' },
        },
      },
      response: {
        200: UserSchema,
      },
    },
    handler: async (request, reply) => {
      return await db.getUserByDiscordId(request.params.discordId);
    },
  });
};

export default users;
