import { pwnedPassword } from 'hibp';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

/**
 * Fetches the pwned status for the given password, indicating whether or not it
 * has been previously exposed in a breach. Passwords can be plain text or a
 * SHA1 hash. The remote API will automatically attempt to discern between the
 * two, but in the case where the password you wish to check is actually a
 * plain text string containing a hash and you don't want the API to treat it as
 * a hash, you can override the auto detection behavior by setting the isAHash
 * option to true.
 *
 * @param {string} password a password (plain text string or SHA1 hash)
 * @param {boolean} [isAHash] the pre-hashed password is a hash (default: false)
 * @param {boolean} [raw] disable the console spinner (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export default (password, isAHash, raw) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  return Promise.resolve(pwnedPassword(password, { isAHash }))
    .then((isPwned) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      logger.log(isPwned ? 'Oh no — pwned!' : 'Good news — no pwnage found!');
    })
    .catch((err) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      logger.error(err.message);
    });
};
