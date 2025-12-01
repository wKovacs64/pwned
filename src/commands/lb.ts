import type { Argv } from 'yargs';
import { latestBreach } from 'hibp';
import { runCommand } from '../utils/run-command.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'lb';
export const describe = 'get the most recently added breach';

interface LbArgvOptions {
  r?: boolean;
}

interface LbHandlerOptions {
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<LbArgvOptions>): Argv<LbHandlerOptions> {
  return yargs
    .option('r', {
      describe: 'output the raw JSON data (or nothing, if no results found)',
      type: 'boolean',
      default: false,
    })
    .alias('r', 'raw')
    .group(['r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');
}

/**
 * Fetches and outputs the most recently added breach.
 *
 * @param {object} argv the parsed argv object
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ raw }: LbHandlerOptions): Promise<void> {
  return runCommand({
    raw: Boolean(raw),
    fetchData: () => latestBreach({ userAgent }),
    hasData: (data) => data !== null,
    noDataMessage: 'No breach found.',
  });
}
