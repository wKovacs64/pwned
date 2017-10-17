import { breach } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'breach <name>';
export const desc = 'get a single breached site by breach name';
export const builder /* istanbul ignore next */ = yargs =>
  yargs.usage('Usage: $0 breach <name> [options]').option('r', {
    alias: 'raw',
    describe: 'output the raw JSON data (or nothing, if no results found)',
    type: 'boolean',
    default: false,
  });

/**
 * Fetches and outputs breach data for a single site by breach name.
 *
 * @param {string} name the name of a breach in the system
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export const handler = ({ name, raw }) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  return Promise.resolve(breach(name))
    .then((breachData) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      if (breachData && raw) {
        logger.log(JSON.stringify(breachData));
      } else if (breachData) {
        logger.log(prettyjson.render(breachData));
      } else if (!breachData && !raw) {
        logger.log('No breach found by that name.');
      }
    })
    .catch((err) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      logger.error(err.message);
    });
};
