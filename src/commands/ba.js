import { breachedAccount } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'ba <account>';
export const desc =
  'get all breaches for an account (username or email address)';
export const builder /* istanbul ignore next */ = yargs =>
  yargs
    .usage('Usage: $0 ba <account> [options]')
    .option('d', {
      alias: 'domain-filter',
      describe: 'filter breach data by domain',
      type: 'string',
      default: '',
    })
    .option('t', {
      alias: 'truncate',
      describe: 'truncate data to just the name of each breach',
      type: 'boolean',
      default: false,
    })
    .option('r', {
      alias: 'raw',
      describe: 'output the raw JSON data (or nothing, if no results found)',
      type: 'boolean',
      default: false,
    })
    .epilogue(`Description:
  ${desc}`);

/**
 * Fetches and outputs breach data for the specified account.
 *
 * @param {string} account a username or email address
 * @param {string} [domain] a domain by which to filter the results (default:
 * all domains)
 * @param {boolean} [truncate] truncate the results to only include the name of
 * each breach (default: false)
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export const handler = ({ account, domain, truncate, raw }) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  return Promise.resolve(breachedAccount(account.trim(), { domain, truncate }))
    .then((breachData) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      if (breachData && raw) {
        logger.log(JSON.stringify(breachData));
      } else if (breachData) {
        logger.log(prettyjson.render(breachData));
      } else if (!breachData && !raw) {
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
