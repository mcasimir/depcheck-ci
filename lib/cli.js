#!/usr/bin/env node
'use strict';

require('babel-polyfill');

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _path = require('path');

var _fs = require('fs');

var _Depcheck = require('./Depcheck');

var _Depcheck2 = _interopRequireDefault(_Depcheck);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _Logger2.default();

var program = _yargs2.default.options({
  config: {
    alias: ['c'],
    describe: 'configuration file path (JSON or Javascript)',
    type: 'string',
    normalize: true,
    default: (0, _path.resolve)(process.cwd(), '.depcheckrc')
  },
  target: {
    alias: ['p'],
    describe: 'Target path (default to process.cwd)',
    type: 'string',
    normalize: true,
    default: process.cwd()
  }
}).locale('en').usage('Usage: $0 [options]').strict().help().version();

var argv = program.argv;

if (argv._.length > 1) {
  program.showHelp();
  process.exit(1);
}

var options = {};

if (argv.config) {
  try {
    options = require((0, _path.resolve)(process.cwd(), argv.config));
  } catch (e) {
    try {
      options = JSON.parse((0, _fs.readFileSync)((0, _path.resolve)(process.cwd(), argv.config)));
    } catch (e) {
      logger.warn(e.message);
      logger.warn('Using default configuration');
    }
  }
}

var depcheck = new _Depcheck2.default(argv.target, options);

depcheck.run().then(function () {
  logger.info('Depcheck ok');
  process.exit(0);
}).catch(function (err) {
  logger.error(err.message);
  process.exit(1);
});