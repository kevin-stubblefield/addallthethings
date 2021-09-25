function loadEnvironmentVariable(keyname) {
  const envVar = process.env[keyname];

  if (!envVar) {
    throw new Error(`Must includ ${keyname} as an environment variable.`);
  }

  return envVar;
}

module.exports = {
  igdbClientId: loadEnvironmentVariable('IGDB_CLIENT_ID'),
  igdbClientSecret: loadEnvironmentVariable('IGDB_CLIENT_SECRET'),
};
