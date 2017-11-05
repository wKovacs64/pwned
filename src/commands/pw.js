import { pwnedPassword } from 'hibp';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'pw <password>';
export const describe =
  'check a password (plain text or SHA1 hash) for public exposure';

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
    .option('s', {
      alias: 'sha1',
      describe: 'password itself is a SHA1 hash (so hash it again)',
      type: 'boolean',
      default: false,
    })
    .option('r', {
      alias: 'raw',
      describe: 'disable the console spinner',
      type: 'boolean',
      default: false,
    })
    .group(['s', 'r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');

/**
 * Fetches the pwned status for the given password, indicating whether or not it
 * has been previously exposed in a breach. Passwords can be plain text or a
 * SHA1 hash. The remote API will automatically attempt to discern between the
 * two, but in the case where the password you wish to check is actually a
 * plain text string containing a hash and you don't want the API to treat it as
 * a hash, you can override the auto detection behavior by setting the isAHash
 * option to true.
 *
 * @param {Object} argv the parsed argv object
 * @param {string} argv.password a password (plain text string or SHA1 hash)
 * @param {boolean} [argv.sha1] the pre-hashed password is a hash (default:
 * false)
 * @param {boolean} [argv.raw] disable the console spinner (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export const handler = async ({ password, sha1: isAHash, raw }) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }

  try {
    const isPwned = await pwnedPassword(password, { isAHash });
    if (!raw && process.stdout.isTTY) {
      spinner.stop(true);
    }
    logger.log(isPwned ? 'Oh no — pwned!' : 'Good news — no pwnage found!');
  } catch (err) {
    if (!raw && process.stdout.isTTY) {
      spinner.stop(true);
    }
    logger.error(err.message);
  }
};
