import { Argv, CommandBuilder } from 'yargs';
import { breaches } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import userAgent from '../utils/ua';

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

export const builder: CommandBuilder<
  BreachesArgvOptions,
  BreachesHandlerOptions
> /* istanbul ignore next */ = (yargs): Argv<BreachesHandlerOptions> =>
  yargs
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

/**
 * Fetches and outputs all breached sites in the system.
 *
 * @param {object} argv the parsed argv object
 * @param {string} [argv.domainFilter] a domain by which to filter the results
 * (default: all domains)
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export const handler = async ({
  domainFilter: domain,
  raw,
}: BreachesHandlerOptions): Promise<void> => {
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
  } catch (err) {
    if (!raw) {
      spinner.fail(err.message);
    } else {
      logger.error(err.message);
    }
  }
};
