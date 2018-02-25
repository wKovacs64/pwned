import { pwnedPasswordRange } from 'hibp';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'pwr <prefix>';
export const describe =
  'check a password (by 5-character SHA-1 hash prefix) for public exposure ' +
  'without submitting the password (https://goo.gl/YAgLHg)';

export const builder /* istanbul ignore next */ = yargs =>
  yargs
    .positional('prefix', {
      type: 'string',
    })
    .check(argv => {
      if (!(argv.prefix.length && argv.prefix.length === 5)) {
        throw new Error('The prefix argument must be 5 characters.');
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
 * Fetches the SHA-1 suffixes for the given 5-character SHA-1 prefix.
 *
 * When a password hash with the same first 5 characters is found in the Pwned
 * Passwords repository, the API will respond with the suffix of every hash
 * beginning with the specified prefix, followed by a count of how many times it
 * appears in the data set. The API consumer can then search the results of the
 * response for the presence of their source hash and if not found, the password
 * does not exist in the data set.
 *
 * @param {Object} argv the parsed argv object
 * @param {string} argv.prefix a 5-character SHA-1 hash prefix
 * @param {boolean} [argv.raw] disable the console spinner (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export const handler = async ({ prefix, raw }) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }

  try {
    const suffixes = await pwnedPasswordRange(prefix);
    if (!raw && process.stdout.isTTY) {
      spinner.stop(true);
    }
    logger.log(suffixes);
  } catch (err) {
    if (!raw && process.stdout.isTTY) {
      spinner.stop(true);
    }
    logger.error(err.message);
  }
};
