import type { Argv } from 'yargs';
import { stealerLogsByWebsiteDomain } from 'hibp';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { runCommand } from '../utils/run-command.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'slbwd <website-domain>';
export const describe = 'get all stealer log email addresses for a website domain';

interface SlbwdArgvOptions {
  websiteDomain: string;
  r?: boolean;
}

interface SlbwdHandlerOptions {
  websiteDomain: string;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<SlbwdArgvOptions>): Argv<SlbwdHandlerOptions> {
  return yargs
    .positional('website-domain', {
      type: 'string',
    })
    .demandOption('website-domain')
    .check((argv) => {
      if (!argv.websiteDomain.length) {
        throw new Error('The website-domain argument must not be empty.');
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
 * Fetches and outputs stealer log email addresses for a website domain.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.websiteDomain the website domain to query
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ websiteDomain, raw }: SlbwdHandlerOptions): Promise<void> {
  return runCommand({
    raw: Boolean(raw),
    fetchData: () =>
      stealerLogsByWebsiteDomain(websiteDomain.trim(), {
        apiKey: config.get('apiKey'),
        userAgent,
      }),
    hasData: (data) => data !== null,
    noDataMessage: 'Good news — no stealer logs found!',
  });
}
