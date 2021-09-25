function loadEnvironmentVariable(keyname: string): string {
  const envVar = process.env[keyname];

  if (!envVar) {
    throw new Error(`Must include ${keyname} as an environment variable.`);
  }

  return envVar;
}

const appConfig = {
  igdbClientId: loadEnvironmentVariable('IGDB_CLIENT_ID'),
  igdbClientSecret: loadEnvironmentVariable('IGDB_CLIENT_SECRET'),
};

export default appConfig;
