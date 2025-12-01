import type { Argv } from 'yargs';
import { subscriptionStatus } from 'hibp';
import { config } from '../config.js';
import { runCommand } from '../utils/run-command.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'subStatus';
export const describe = 'get the subscription status of your API key';

interface SubStatusArgvOptions {
  r?: boolean;
}

interface SubStatusHandlerOptions {
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<SubStatusArgvOptions>): Argv<SubStatusHandlerOptions> {
  return yargs
    .option('r', {
      describe: 'output the raw JSON data',
      type: 'boolean',
      default: false,
    })
    .alias('r', 'raw')
    .group(['r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');
}

/**
 * Fetches and outputs your subscription status (of your API key).
 *
 * @param {object} argv the parsed argv object
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ raw }: SubStatusHandlerOptions): Promise<void> {
  return runCommand({
    raw: Boolean(raw),
    fetchData: () =>
      subscriptionStatus({
        apiKey: config.get('apiKey'),
        userAgent,
      }),
    hasData: () => true,
  });
}
