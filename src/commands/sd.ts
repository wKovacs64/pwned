import type { Argv } from 'yargs';
import { subscribedDomains } from 'hibp';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { runCommand } from '../utils/run-command.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'sd';
export const describe = 'get all subscribed domains for your account';

interface SdArgvOptions {
  r?: boolean;
}

interface SdHandlerOptions {
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<SdArgvOptions>): Argv<SdHandlerOptions> {
  return yargs
    .option('r', {
      alias: 'raw',
      describe: 'output the raw JSON data (or an empty array, if no results found)',
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
 * Fetches and outputs subscribed domains for your account.
 *
 * @param {object} argv the parsed argv object
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ raw }: SdHandlerOptions): Promise<void> {
  return runCommand({
    raw: Boolean(raw),
    fetchData: () =>
      subscribedDomains({
        apiKey: config.get('apiKey'),
        userAgent,
      }),
    hasData: (data) => data.length > 0,
    noDataMessage: 'No subscribed domains found.',
  });
}
