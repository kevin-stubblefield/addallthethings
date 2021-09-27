import fp from 'fastify-plugin';

module.exports = fp(async function (fastify, opts) {
  fastify.log.info('Add knex to do db interactions');
});
