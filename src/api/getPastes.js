import hibp from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

/**
 * Fetches and outputs all pastes for an account (email address).
 *
 * @param {string} email the email address to query
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export default (email, raw) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  return Promise
    .resolve(hibp.pasteAccount(email))
    .then((pasteData) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      if (pasteData && raw) {
        logger.log(JSON.stringify(pasteData));
      } else if (pasteData) {
        logger.log(prettyjson.render(pasteData));
      } else if (!pasteData && !raw) {
        logger.log('Good news — no pwnage found!');
      }
    })
    .catch((err) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      logger.error(err.message);
    });
};
