#!/usr/bin/env node
const { program } = require('commander');
const InfisicalClient = require('../index');

// Document available cli args
program
  .name('npx infisical-node/cli')
  .description('Load Infisical env variables into process.env')
  .argument('<token>', 'Infisical API token')
  .argument('<env>', 'Environment in Infisical')
  .argument('<path>', 'Secrets path');

// Load args from user
program.parse();

// Load secrets into process.env
(async function () {
  const client = new InfisicalClient({
    token: program.args[0],
  });

  await client.getAllSecrets({
    environment: program.args[1],
    path: program.args[2],
    attachToProcessEnv: true,
    includeImports: false,
  });
})()

