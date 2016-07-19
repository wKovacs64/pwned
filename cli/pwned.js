#!/usr/bin/env node

// Enable source map support
import 'source-map-support/register';

// Polyfill Promise if necessary
import {polyfill} from 'es6-promise';
if (global.Promise === undefined) {
  polyfill();
}

import program from 'commander';
import * as pkg from '../package.json';
import addCommands from '../lib/commands';

// Begin command-line argument configuration
program
    .usage('[option | command]')
    .description('Each command has its own -h (--help) option.')
    .version(pkg.version, '-v, --version');

// Add all the commands
addCommands(program);

// Display help and exit if unknown arguments are provided
program.on('*', () => {
  program.help();
});

// Initiate the parser
program.parse(process.argv);

// Display help and exit if no arguments are provided
if (!process.argv.slice(2).length) {
  program.help();
}
