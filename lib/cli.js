#!/usr/bin/env node

const yargs = require('yargs');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const Depcheck = require('./depcheck');
const Logger = require('./logger');
const logger = new Logger();

const program = yargs
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

const argv = program.argv;

if (argv._.length > 1) {
  program.showHelp();
  process.exit(1); // eslint-disable-line
}

const configPath = resolve(process.cwd(), argv.config);
const targetPath = resolve(process.cwd(), argv.target);
const packageJsonPath = resolve(targetPath, 'package.json');
const packageJson = require(packageJsonPath);

let options = null;
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

const depcheck = new Depcheck(argv.target, options);

depcheck.run()
  .then(function() {
    logger.info('Depcheck ok');
    process.exit(0); // eslint-disable-line
  })
  .catch(function(err) {
    logger.error(err.message);

    process.exit(1); // eslint-disable-line
  });
