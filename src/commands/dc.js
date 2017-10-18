import { dataClasses } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'dc';
export const describe = 'get all data classes in the system';

export const builder /* istanbul ignore next */ = yargs =>
  yargs
    .option('r', {
      alias: 'raw',
      describe: 'output the raw JSON data',
      type: 'boolean',
      default: false,
    })
    .group(['r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');

/**
 * Fetches and outputs all data classes in the system.
 *
 * @param {Object} argv the parsed argv object
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export const handler = ({ raw }) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  return Promise.resolve(dataClasses())
    .then((allDataClasses) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      if (allDataClasses.length && raw) {
        logger.log(JSON.stringify(allDataClasses));
      } else if (allDataClasses.length) {
        logger.log(prettyjson.render(allDataClasses));
      } else if (!allDataClasses.length && !raw) {
        logger.log(
          'No data classes found. This is unexpected - the remote API may be ' +
            'having difficulties.',
        );
      }
    })
    .catch((err) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      logger.error(err.message);
    });
};
