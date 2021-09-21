import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async function (fastify, opts) {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Healthcheck'],
      description:
        'Healthcheck endpoint to determine if service is up and running.',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    },
  });
};

// const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
//   fastify.get('/', async function (request, reply) {
//     return { status: 'ok', timestamp: new Date().toISOString() };
//   });
// };

export default root;
