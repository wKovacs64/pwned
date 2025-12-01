import type { Argv } from 'yargs';
import { breaches } from 'hibp';
import { runCommand } from '../utils/run-command.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'breaches';
export const describe = 'get all breaches in the system';

interface BreachesArgvOptions {
  d?: string;
  r?: boolean;
}

interface BreachesHandlerOptions {
  domainFilter?: string;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<BreachesArgvOptions>): Argv<BreachesHandlerOptions> {
  return yargs
    .option('d', {
      describe: 'filter breach data by domain',
      type: 'string',
    })
    .alias('d', 'domain-filter')
    .option('r', {
      describe: 'output the raw JSON data (or nothing, if no results found)',
      type: 'boolean',
      default: false,
    })
    .alias('r', 'raw')
    .group(['d', 'r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');
}

/**
 * Fetches and outputs all breached sites in the system.
 *
 * @param {object} argv the parsed argv object
 * @param {string} [argv.domainFilter] a domain by which to filter the results
 * (default: all domains)
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({
  domainFilter: domain,
  raw,
}: BreachesHandlerOptions): Promise<void> {
  return runCommand({
    raw: Boolean(raw),
    fetchData: () => breaches({ domain, userAgent }),
    hasData: (data) => data.length > 0,
    noDataMessage: 'No breaches found.',
  });
}
