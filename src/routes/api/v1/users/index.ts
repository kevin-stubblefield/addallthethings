import { FastifyPluginAsync, RequestGenericInterface } from 'fastify';
import { UserDB } from '../../../../models/user.model';
import { services } from '../../../../services';
import { UserSchema } from './schemas';

interface UserRetrieveByDiscordIdRequest extends RequestGenericInterface {
  Params: {
    discord_id: string;
  };
}

interface DiscordUserCreateRequest extends RequestGenericInterface {
  Body: {
    discord_username: string;
    discord_discriminator: string;
    discord_tag: string;
    discord_user_id: string;
  };
}

const users: FastifyPluginAsync = async function (fastify, opts) {
  const db = services(fastify.db).userService;

  fastify.route<UserRetrieveByDiscordIdRequest>({
    method: 'GET',
    url: '/:discord_id',
    schema: {
      tags: ['Users'],
      description: 'Retrieve a user from the database by their discord id',
      params: {
        type: 'object',
        properties: {
          discord_id: { type: 'string' },
        },
      },
      response: {
        200: UserSchema,
      },
    },
    handler: async (request, reply) => {
      return await db.getUserByDiscordId(request.params.discord_id);
    },
  });

  fastify.route<DiscordUserCreateRequest>({
    method: 'POST',
    url: '/',
    schema: {
      tags: ['Users'],
      description: 'Create a new user with discord information',
      body: {
        type: 'object',
        required: [
          'discord_username',
          'discord_discriminator',
          'discord_tag',
          'discord_user_id',
        ],
        properties: {
          discord_username: { type: 'string' },
          discord_discriminator: { type: 'string' },
          discord_tag: { type: 'string' },
          discord_user_id: { type: 'string' },
        },
      },
      response: {
        201: UserSchema,
      },
    },
    handler: async (request, reply) => {
      let result: UserDB;
      try {
        result = await db.insertDiscordUser(request.body);
      } catch (err) {
        throw { statusCode: 409, message: 'User already exists' };
      }

      reply.statusCode = 201;
      return result;
    },
  });
};

export default users;
