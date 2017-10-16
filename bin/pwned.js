#!/usr/bin/env node
require('source-map-support/register');
const program = require('commander');
const pkg = require('../package.json');
// eslint-disable-next-line import/no-unresolved
const addCommands = require('../lib/commands').default;

// Begin command-line argument configuration
program
  .usage('[option | command]')
  .description('Each command has its own -h (--help) option.')
  .version(pkg.version, '-v, --version');

// Add all the commands
addCommands(program);

// Display help and exit if unknown arguments are provided
program.on('command:*', () => program.help());

// Initiate the parser
program.parse(process.argv);

// Display help and exit if no arguments are provided
if (!process.argv.slice(2).length) {
  program.help();
}
