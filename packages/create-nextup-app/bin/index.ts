#!/usr/bin/env node

import { createWorkspace } from 'create-nx-workspace';
import { names } from '@nx/devkit';
import yargs from 'yargs';

async function main() {
  const parser = yargs(process.argv.slice(2))
    .command('<name>', 'The name for the workspace')
    .demandCommand(1, 'A name for the workspace is needed')
    .option('scope', {
      type: 'string',
      describe: 'Your organization scope',
    })
    .option('website', {
      type: 'string',
      describe: 'website to host app to',
      default: 'macchiato.life',
    })
    .help();

  const argv = await parser.parse();
  const name = names(argv._[0] as string).name;
  const scope = names(argv.scope ?? name).name;
  const website = names(argv.website).name;
  const dbname = names(name).fileName;

  console.log(`Creating the workspace: ${name}`);

  // This assumes "nextup" and "create-nextup-app" are at the same version
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const presetVersion = require('../package.json').version;

  // TODO: update below to customize the workspace
  const { directory } = await createWorkspace(`nextup@${presetVersion}`, {
    name,
    nxCloud: 'skip',
    packageManager: 'pnpm',
    scope,
    website,
    dbname,
  });

  console.log(`Successfully created the workspace: ${directory}.`);
}

main();
