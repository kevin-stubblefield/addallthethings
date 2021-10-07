import { join } from 'path';
import AutoLoad from 'fastify-autoload';
import { FastifyPluginAsync } from 'fastify';

function loadEnv(key: string): string {
  const envVar = process.env[key];

  if (!envVar) {
    throw new Error(`Must include ${key} as an environment variable.`);
  }

  return envVar;
}

type AppConfig = {
  postgresUri: string;
  igdbClientId: string;
  igdbClientSecret: string;
};

const app: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const appConfig = {
    postgresUri: loadEnv('POSTGRES_URI'),
    igdbClientId: loadEnv('IGDB_CLIENT_ID'),
    igdbClientSecret: loadEnv('IGDB_CLIENT_SECRET'),
  };
  // Place here your custom code!
  fastify.decorate('config', appConfig);
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
  });
};

export default app;
export { app };

declare module 'fastify' {
  export interface FastifyInstance {
    config: AppConfig;
  }
}
