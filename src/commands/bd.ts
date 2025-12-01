import type { Argv } from 'yargs';
import { breachedDomain } from 'hibp';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { runCommand } from '../utils/run-command.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'bd <domain>';
export const describe = 'get all breached email addresses for a domain';

interface BdArgvOptions {
  domain: string;
  r?: boolean;
}

interface BdHandlerOptions {
  domain: string;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<BdArgvOptions>): Argv<BdHandlerOptions> {
  return yargs
    .positional('domain', {
      type: 'string',
    })
    .demandOption('domain')
    .check((argv) => {
      if (!argv.domain.length) {
        throw new Error('The domain argument must not be empty.');
      }
      return true;
    })
    .option('r', {
      alias: 'raw',
      describe: 'output the raw JSON data (or nothing, if no results found)',
      type: 'boolean',
      default: false,
    })
    .group(['r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:').epilog(oneLine`
      🔑 This command requires an API key. Make sure you've run the "apiKey"
      command first.
    `);
}

/**
 * Fetches and outputs breached email addresses for a domain.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.domain the domain to query
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ domain, raw }: BdHandlerOptions): Promise<void> {
  return runCommand({
    raw: Boolean(raw),
    fetchData: () =>
      breachedDomain(domain.trim(), {
        apiKey: config.get('apiKey'),
        userAgent,
      }),
    hasData: (data) => data !== null,
    noDataMessage: 'Good news — no pwnage found!',
  });
}
