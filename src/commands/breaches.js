import { breaches } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'breaches';
export const describe = 'get all breaches in the system';

export const builder /* istanbul ignore next */ = yargs =>
  yargs
    .option('d', {
      alias: 'domain-filter',
      describe: 'filter breach data by domain',
      type: 'string',
    })
    .option('r', {
      alias: 'raw',
      describe: 'output the raw JSON data (or nothing, if no results found)',
      type: 'boolean',
      default: false,
    })
    .group(['d', 'r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');

/**
 * Fetches and outputs all breached sites in the system.
 *
 * @param {Object} argv the parsed argv object
 * @param {string} [argv.domainFilter] a domain by which to filter the results
 * (default: all domains)
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export const handler = async ({ domainFilter: domain, raw }) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }

  try {
    const breachData = await breaches({ domain });
    if (!raw && process.stdout.isTTY) {
      spinner.stop(true);
    }
    if (breachData.length && raw) {
      logger.log(JSON.stringify(breachData));
    } else if (breachData.length) {
      logger.log(prettyjson.render(breachData));
    } else if (!breachData.length && !raw) {
      logger.log('No breaches found.');
    }
  } catch (err) {
    if (!raw && process.stdout.isTTY) {
      spinner.stop(true);
    }
    logger.error(err.message);
  }
};
