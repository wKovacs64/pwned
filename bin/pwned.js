#!/usr/bin/env node

// Polyfill Promise if necessary
if (global.Promise === undefined) {
  require('es6-promise').polyfill();
}

var program = require('commander');
var pkg = require('../package.json');
var addCommands = require('../lib/commands');

// Begin command-line argument configuration
program
    .usage('[option | command]')
    .description('Each command has its own -h (--help) option.')
    .version(pkg.version, '-v, --version');

// Add all the commands
addCommands(program);

// Display help and exit if unknown arguments are provided
program.on('*', function () {
  program.help();
});

// Initiate the parser
program.parse(process.argv);

// Display help and exit if no arguments are provided
if (!process.argv.slice(2).length) {
  program.help();
}
