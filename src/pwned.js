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
import getBreach from './actions/getBreach';
import getBreachedAccount from './actions/getBreachedAccount';
import getBreaches from './actions/getBreaches';
import getDataClasses from './actions/getDataClasses';
import getPastes from './actions/getPastes';

// Begin command-line argument configuration
program
    .usage(`${pkg.name} [option | command]`)
    .description('Each command has its own -h (--help) option.')
    .version(pkg.version, '-v, --version');

// Fetch and display breach data for an account
program
    .command('ba <account>')
    .description('get all breaches for an account (username or email address)')
    .option('-d, --domain-filter <domain>', 'filter breach data by domain')
    .option('-r, --raw', 'output the raw JSON data')
    .option('-t, --truncate', 'truncate data to just the name of each breach')
    .action((account, options) => {
      account = account.trim();
      if (account.length) {
        getBreachedAccount(account,
            options.domainFilter,
            options.truncate,
            options.raw);
      } else {
        program.help();
      }
    });

// Fetch and display all breach data in the system
program
    .command('breaches')
    .description('get all breaches in the system')
    .option('-d, --domain-filter <domain>', 'filter breach data by domain')
    .option('-r, --raw', 'output the raw JSON data')
    .action((options) => {
      getBreaches(options.domainFilter, options.raw);
    });

// Fetch and display a single breached site by name
program
    .command('breach <name>')
    .description('get a single breached site by breach name')
    .option('-r, --raw', 'output the raw JSON data')
    .action((name, options) => {
      name = name.trim();
      if (name.length) {
        getBreach(name, options.raw);
      } else {
        program.help();
      }
    });

// Fetch and display all data classes in the system
program
    .command('dc')
    .description('get all data classes in the system')
    .option('-r, --raw', 'output the raw JSON data')
    .action((options) => {
      getDataClasses(options.raw);
    });

// Fetch and display all pastes for an account
program
    .command('pa <email>')
    .description('get all pastes for an account (email address)')
    .option('-r, --raw', 'output the raw JSON data')
    .action((email, options) => {
      email = email.trim();
      if (email.length) {
        getPastes(email, options.raw);
      } else {
        program.help();
      }
    });

// Display help and exit if unknown arguments are provided
program.on('*', () => {
  program.help();
});

// Display help and exit if no arguments are provided
if (!process.argv.slice(2).length) {
  program.help();
}

// Initiate the parser
program.parse(process.argv);
