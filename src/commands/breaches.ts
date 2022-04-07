import type { Argv } from 'yargs';
import { breaches } from 'hibp';
import prettyjson from 'prettyjson';
import { logger, spinner, userAgent } from '../utils';

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

/* c8 ignore start */
export function builder(
  yargs: Argv<BreachesArgvOptions>,
): Argv<BreachesHandlerOptions> {
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
/* c8 ignore stop */

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
  if (!raw) {
    spinner.start();
  }

  try {
    const breachData = await breaches({ domain, userAgent });
    if (breachData.length && raw) {
      logger.log(JSON.stringify(breachData));
    } else if (breachData.length) {
      spinner.stop();
      logger.log(prettyjson.render(breachData));
    } else if (!breachData.length && !raw) {
      spinner.succeed('No breaches found.');
    }
  } catch (err: unknown) {
    /* c8 ignore else */
    if (err instanceof Error) {
      if (!raw) {
        spinner.fail(err.message);
      } else {
        logger.error(err.message);
      }
    }
  }
}
