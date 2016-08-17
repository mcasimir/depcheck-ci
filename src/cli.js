#!/usr/bin/env node

import 'babel-polyfill';
import yargs from 'yargs';
import {resolve} from 'path';
import {readFileSync} from 'fs';
import Depcheck from './Depcheck';
import Logger from './Logger';
const logger = new Logger();

let program = yargs
  .options({
    config: {
      alias: ['c'],
      describe: 'configuration file path (JSON or Javascript)',
      type: 'string',
      normalize: true,
      default: resolve(process.cwd(), '.depcheckrc')
    },
    target: {
      alias: ['p'],
      describe: 'Target path (default to process.cwd)',
      type: 'string',
      normalize: true,
      default: process.cwd()
    }
  })
  .locale('en')
  .usage('Usage: $0 [options]')
  .strict()
  .help()
  .version();

let argv = program.argv;

if (argv._.length > 1) {
  program.showHelp();
  process.exit(1);
}

let options = null;
let configPath = resolve(process.cwd(), argv.config);
let targetPath = resolve(process.cwd(), argv.target);
let packageJsonPath = resolve(targetPath, 'package.json');
let packageJson = require(packageJsonPath);

try {
  options = require(configPath);
} catch (e) {
  try {
    options = JSON.parse(readFileSync(configPath));
  } catch (e) {
    options = packageJson.depcheck;
  }
}

if (!options) {
  logger.warn('No configuration provided. Using default configuration.');
}

let depcheck = new Depcheck(argv.target, options);

depcheck.run()
  .then(function() {
    logger.info('Depcheck ok');
    process.exit(0);
  })
  .catch(function(err) {
    logger.error(err.message);
    process.exit(1);
  });
