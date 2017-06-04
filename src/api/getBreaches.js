import hibp from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

/**
 * Fetches and outputs all breached sites in the system.
 *
 * @param {string} [domain] a domain by which to filter the results
 * (default: all domains)
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export default (domain, raw) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  return Promise.resolve(hibp.breaches({ domain }))
    .then((breachData) => {
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
    })
    .catch((err) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      logger.error(err.message);
    });
};
