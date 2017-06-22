import { dataClasses as getDataClasses } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

/**
 * Fetches and outputs all data classes in the system.
 *
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export default (raw) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  return Promise.resolve(getDataClasses())
    .then((dataClasses) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      if (dataClasses.length && raw) {
        logger.log(JSON.stringify(dataClasses));
      } else if (dataClasses.length) {
        logger.log(prettyjson.render(dataClasses));
      } else if (!dataClasses.length && !raw) {
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
