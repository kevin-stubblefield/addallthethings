import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { fastifySwagger } from 'fastify-swagger';

const swaggerPlugin: FastifyPluginAsync = async (fastify, opts) => {
  fastify.register(fastifySwagger, {
    routePrefix: '/swagger',
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Reservoid',
        description:
          "A media backlog to keep track of what you're watching, playing, reading, etc.",
        version: '0.1.0',
      },
      host: 'localhost',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
    },
  });
};

export default fp(swaggerPlugin);
