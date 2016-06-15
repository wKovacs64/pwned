#!/usr/bin/env node

// Enable source map support
import 'source-map-support/register';

// Polyfill Promise if necessary
import {polyfill} from 'es6-promise';
if (global.Promise === undefined) {
  polyfill();
}

import hibp from 'hibp';
import program from 'commander';
import prettyjson from 'prettyjson';
import {Spinner} from 'cli-spinner';
import * as pkg from '../package.json';

// Configure the progress spinner
const fetchSpinner = new Spinner('Fetching data... %s');
fetchSpinner.setSpinnerString('|/-\\');

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

/**
 * Fetches and outputs breach data for the specified account.
 *
 * @param {string} account a username or email address
 * @param {string} [domain] a domain by which to filter the results
 * @param {boolean} [truncateResults] truncate the results to only include the
 * name of each breach (default: false)
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {undefined}
 */
function getBreachedAccount (account, domain, truncateResults, raw) {
  if (!raw && process.stdout.isTTY) {
    fetchSpinner.start();
  }
  hibp.breachedAccount(account, domain, truncateResults)
      .then((breachData) => {
        if (!raw && process.stdout.isTTY) {
          fetchSpinner.stop();
          console.log();
        }
        if (!breachData) {
          console.log('Good news — no pwnage found!');
        } else if (raw) {
          console.log(JSON.stringify(breachData));
        } else {
          console.log(prettyjson.render(breachData));
        }
      })
      .catch((err) => {
        if (!raw && process.stdout.isTTY) {
          fetchSpinner.stop();
          console.log();
        }
        console.error(err.message);
      });
}

/**
 * Fetches and outputs all breached sites in the system.
 *
 * @param {string} [domain] a domain by which to filter the results
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {undefined}
 */
function getBreaches (domain, raw) {
  if (!raw && process.stdout.isTTY) {
    fetchSpinner.start();
  }
  hibp.breaches(domain)
      .then((breachData) => {
        if (!raw && process.stdout.isTTY) {
          fetchSpinner.stop();
          console.log();
        }
        if (raw) {
          console.log(JSON.stringify(breachData));
        } else if (breachData.length) {
          console.log(prettyjson.render(breachData));
        } else {
          console.log('No breaches found.');
        }
      })
      .catch((err) => {
        if (!raw && process.stdout.isTTY) {
          fetchSpinner.stop();
          console.log();
        }
        console.error(err.message);
      });
}

/**
 * Fetches and outputs breach data for a single site by breach name.
 *
 * @param {string} name the name of a breach in the system
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {undefined}
 */
function getBreach (name, raw) {
  if (!raw && process.stdout.isTTY) {
    fetchSpinner.start();
  }
  hibp.breach(name)
      .then((breachData) => {
        if (!raw && process.stdout.isTTY) {
          fetchSpinner.stop();
          console.log();
        }
        if (raw) {
          console.log(JSON.stringify(breachData));
        } else if (breachData) {
          console.log(prettyjson.render(breachData));
        } else {
          console.log('No breach found by that name.');
        }
      })
      .catch((err) => {
        if (!raw && process.stdout.isTTY) {
          fetchSpinner.stop();
          console.log();
        }
        console.error(err.message);
      });
}

/**
 * Fetches and outputs all data classes in the system.
 *
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {undefined}
 */
function getDataClasses (raw) {
  if (!raw && process.stdout.isTTY) {
    fetchSpinner.start();
  }
  hibp.dataClasses()
      .then((dataClasses) => {
        if (!raw && process.stdout.isTTY) {
          fetchSpinner.stop();
          console.log();
        }
        if (raw) {
          console.log(JSON.stringify(dataClasses));
        } else {
          console.log(prettyjson.render(dataClasses));
        }
      })
      .catch((err) => {
        if (!raw && process.stdout.isTTY) {
          fetchSpinner.stop();
          console.log();
        }
        console.error(err.message);
      });
}

/**
 * Fetches and outputs all pastes for an account (email address).
 *
 * @param {string} email the email address to query
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {undefined}
 */
function getPastes (email, raw) {
  if (!raw && process.stdout.isTTY) {
    fetchSpinner.start();
  }
  hibp.pasteAccount(email)
      .then((pasteData) => {
        if (!raw && process.stdout.isTTY) {
          fetchSpinner.stop();
          console.log();
        }
        if (raw) {
          console.log(JSON.stringify(pasteData));
        } else if (pasteData) {
          console.log(prettyjson.render(pasteData));
        } else {
          console.log('Good news — no pwnage found!');
        }
      })
      .catch((err) => {
        if (!raw && process.stdout.isTTY) {
          fetchSpinner.stop();
          console.log();
        }
        console.error(err.message);
      });
}
