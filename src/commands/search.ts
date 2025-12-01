import type { Argv } from 'yargs';
import { search } from 'hibp';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { runCommand } from '../utils/run-command.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'search <account|email>';
export const describe = 'search breaches and pastes for an account (username or email address)';

interface SearchArgvOptions {
  account: string;
  d?: string;
  t?: boolean;
  r?: boolean;
}

interface SearchHandlerOptions {
  account: string;
  domainFilter?: string;
  truncate?: boolean;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<SearchArgvOptions>): Argv<SearchHandlerOptions> {
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
    .group(['d', 't', 'r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:').epilog(oneLine`
      🔑 This command requires an API key. Make sure you've run the "apiKey"
      command first.
    `);
}

/**
 * Fetches and outputs breach and paste data for the specified account.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.account a username or email address
 * @param {string} [argv.domainFilter] a domain by which to filter the results
 * (default: all domains)
 * @param {boolean} [argv.truncate] truncate the results to only include the
 * name of each breach (default: true)
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({
  account,
  domainFilter: domain,
  truncate,
  raw,
}: SearchHandlerOptions): Promise<void> {
  return runCommand({
    raw: Boolean(raw),
    fetchData: () =>
      search(account, {
        apiKey: config.get('apiKey'),
        domain,
        truncate,
        userAgent,
      }),
    hasData: (data) => !!(data.breaches || data.pastes),
    noDataMessage: 'Good news — no pwnage found!',
  });
}
