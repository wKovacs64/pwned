#!/usr/bin/env node
require('source-map-support/register');
require('@babel/polyfill');
const path = require('path');
const yargs = require('yargs');

yargs
  .commandDir(path.join(__dirname, '..', 'lib', 'commands'))
  .demandCommand()
  .recommendCommands()
  .strict()
  .wrap(Math.min(100, yargs.terminalWidth()))
  .alias('h', 'help')
  .alias('v', 'version').argv;
