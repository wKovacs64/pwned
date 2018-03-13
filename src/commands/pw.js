import { pwnedPassword } from 'hibp';
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
 * Securely fetches the number of times the given password has been exposed in a
 * breach.
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
    const pwnCount = await pwnedPassword(password);
    if (!raw && process.stdout.isTTY) {
      spinner.stop(true);
    }
    logger.log(
      pwnCount
        ? `Oh no — pwned ${pwnCount} times!`
        : 'Good news — no pwnage found!',
    );
  } catch (err) {
    if (!raw && process.stdout.isTTY) {
      spinner.stop(true);
    }
    logger.error(err.message);
  }
};
