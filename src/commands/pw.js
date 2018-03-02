import sha1 from 'js-sha1';
import { pwnedPasswordRange } from 'hibp';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'pw <password>';
export const describe = 'securely check a password for public exposure';

export const builder /* istanbul ignore next */ = yargs =>
  yargs
    .positional('password', {
      type: 'string',
    })
    .check(argv => {
      if (!argv.password.length) {
        throw new Error('The password argument must not be empty.');
      }
      return true;
    })
    .option('r', {
      alias: 'raw',
      describe: 'disable the console spinner',
      type: 'boolean',
      default: false,
    })
    .group(['r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');

/**
 * Fetches the pwned status for the given password, indicating whether or not it
 * has been previously exposed in a breach.
 *
 * When a password hash with the same first 5 characters is found in the Pwned
 * Passwords repository, the API will respond with the suffix of every hash
 * beginning with the specified prefix, followed by a count of how many times it
 * appears in the data set. The API consumer can then search the results of the
 * response for the presence of their source hash and if not found, the password
 * does not exist in the data set.
 *
 * @param {Object} argv the parsed argv object
 * @param {string} argv.password a password (plain text)
 * @param {boolean} [argv.raw] disable the console spinner (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export const handler = async ({ password, raw }) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }

  try {
    const hash = sha1(password).toUpperCase();
    const suffixes = await pwnedPasswordRange(hash.slice(0, 5));
    if (!raw && process.stdout.isTTY) {
      spinner.stop(true);
    }
    const isPwned = suffixes.includes(hash.slice(5));
    logger.log(isPwned ? 'Oh no — pwned!' : 'Good news — no pwnage found!');
  } catch (err) {
    if (!raw && process.stdout.isTTY) {
      spinner.stop(true);
    }
    logger.error(err.message);
  }
};
