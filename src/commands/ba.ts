import type { Argv } from 'yargs';
import { breachedAccount } from 'hibp';
import prettyjson from 'prettyjson';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';
import { translateApiError } from '../utils/translate-api-error.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'ba <account|email>';
export const describe =
  'get all breaches for an account (username or email address)';

interface BaArgvOptions {
  account: string;
  d?: string;
  i?: boolean;
  t?: boolean;
  r?: boolean;
}

interface BaHandlerOptions {
  account: string;
  domainFilter?: string;
  includeUnverified?: boolean;
  truncate?: boolean;
  raw?: boolean;
}

/* c8 ignore start */
export function builder(yargs: Argv<BaArgvOptions>): Argv<BaHandlerOptions> {
  return yargs
    .positional('account', {
      alias: 'email',
      type: 'string',
    })
    .demandOption('account')
    .check((argv) => {
      if (!argv.account.length) {
        throw new Error('The account argument must not be empty.');
      }
      return true;
    })
    .option('d', {
      alias: 'domain-filter',
      describe: 'filter breach data by domain',
      type: 'string',
    })
    .option('i', {
      alias: 'include-unverified',
      describe: 'include unverified breaches in the results',
      type: 'boolean',
      default: true,
    })
    .option('t', {
      alias: 'truncate',
      describe: 'truncate data to just the name of each breach',
      type: 'boolean',
      default: true,
    })
    .option('r', {
      alias: 'raw',
      describe: 'output the raw JSON data (or nothing, if no results found)',
      type: 'boolean',
      default: false,
    })
    .group(['d', 'i', 't', 'r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:').epilog(oneLine`
      🔑 This command requires an API key. Make sure you've run the "apiKey"
      command first.
    `);
}
/* c8 ignore stop */

/**
 * Fetches and outputs breach data for the specified account.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.account a username or email address
 * @param {string} [argv.domainFilter] a domain by which to filter the results
 * (default: all domains)
 * @param {boolean} [argv.includeUnverified] include "unverified" breaches in
 * the results (default: true)
 * @param {boolean} [argv.truncate] truncate the results to only include the
 * name of each breach (default: true)
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({
  account,
  domainFilter: domain,
  includeUnverified,
  truncate,
  raw,
}: BaHandlerOptions): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const breachData = await breachedAccount(account.trim(), {
      apiKey: config.get('apiKey'),
      domain,
      includeUnverified,
      truncate,
      userAgent,
    });
    if (breachData && raw) {
      logger.log(JSON.stringify(breachData));
    } else if (breachData) {
      spinner.stop();
      logger.log(prettyjson.render(breachData));
    } else if (!raw) {
      spinner.succeed('Good news — no pwnage found!');
    }
  } catch (err: unknown) {
    /* c8 ignore else */
    if (err instanceof Error) {
      const errMsg = translateApiError(err.message);
      if (!raw) {
        spinner.fail(errMsg);
      } else {
        logger.error(errMsg);
      }
    }
  }
}
