import { breach } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'breach <name>';
export const describe = 'get a single breached site by breach name';
const usage = `Usage: $0 breach <name> [options]

Description:
  ${describe}`;

export const builder /* istanbul ignore next */ = yargs =>
  yargs
    .usage(usage)
    .positional('name', {
      type: 'string',
    })
    .check((argv) => {
      if (!argv.name.length) {
        throw new Error('The name argument must not be empty.');
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
    .group(['h', 'v'], 'Global Options:');

/**
 * Fetches and outputs breach data for a single site by breach name.
 *
 * @param {Object} argv the parsed argv object
 * @param {string} argv.name the name of a breach in the system
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
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
