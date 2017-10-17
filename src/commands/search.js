import { search } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'search <account|email>';
export const describe =
  'search breaches and pastes for an account (username or email address)';
const usage = `Usage: $0 search <account|email> [options]

Description:
  ${describe}`;

export const builder /* istanbul ignore next */ = yargs =>
  yargs
    .usage(usage)
    .positional('account', {
      alias: 'email',
      type: 'string',
    })
    .check((argv) => {
      if (!argv.account.length) {
        throw new Error('The account argument must not be empty.');
      }
      return true;
    })
    .option('d', {
      alias: 'domain-filter',
      describe: 'filter breach data by domain',
      type: 'string',
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
    .group(['d', 't', 'r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');

export const handler = ({ account, domainFilter: domain, truncate, raw }) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  return Promise.resolve(search(account, { domain, truncate }))
    .then((searchData) => {
      const foundData = !!(searchData.breaches || searchData.pastes);
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      if (foundData && raw) {
        logger.log(JSON.stringify(searchData));
      } else if (foundData) {
        logger.log(prettyjson.render(searchData));
      } else if (!foundData && !raw) {
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
