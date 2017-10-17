import { pasteAccount } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'pa <email>';
export const describe = 'get all pastes for an account (email address)';
const usage = `Usage: $0 pa <email> [options]

Description:
  ${describe}`;

export const builder /* istanbul ignore next */ = yargs =>
  yargs
    .usage(usage)
    .positional('email', {
      type: 'string',
    })
    .check((argv) => {
      if (!argv.email.length) {
        throw new Error('The email argument must not be empty.');
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
 * Fetches and outputs all pastes for an account (email address).
 *
 * @param {string} email the email address to query
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export const handler = ({ email, raw }) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  return Promise.resolve(pasteAccount(email))
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
