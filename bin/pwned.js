#!/usr/bin/env node
require('source-map-support/register');
const path = require('path');
const yargs = require('yargs');

yargs
  .commandDir(path.join(__dirname, '..', 'lib', 'commands'))
  .demandCommand()
  .strict()
  .wrap(Math.min(110, yargs.terminalWidth()))
  .alias('h', 'help')
  .alias('v', 'version').argv;
