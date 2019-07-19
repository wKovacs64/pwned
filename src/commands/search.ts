import { Argv, CommandBuilder } from 'yargs';
import { search } from 'hibp';
import prettyjson from 'prettyjson';
import { oneLine } from 'common-tags';
import config from '../utils/config';
import translateApiError from '../utils/translateApiError';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import userAgent from '../utils/ua';

export const command = 'search <account|email>';
export const describe =
  'search breaches and pastes for an account (username or email address)';

interface SearchArgvOptions {
  account: string;
  d?: string;
  t?: boolean;
  r?: boolean;
}

interface SearchHandlerOptions {
  account: string;
  domainFilter?: string;
  truncate?: boolean;
  raw?: boolean;
}

export const builder: CommandBuilder<
  SearchArgvOptions,
  SearchHandlerOptions
> /* istanbul ignore next */ = (yargs): Argv<SearchHandlerOptions> =>
  yargs
    .positional('account', {
      alias: 'email',
      type: 'string',
    })
    .demand('account')
    .check(argv => {
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
      default: true,
    })
    .option('r', {
      alias: 'raw',
      describe: 'output the raw JSON data (or nothing, if no results found)',
      type: 'boolean',
      default: false,
    })
    .group(['d', 't', 'r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:').epilog(oneLine`
      🔑 This command requires an API key. Make sure you've run the "apiKey"
      command first.
    `);

/**
 * Fetches and outputs breach and paste data for the specified account.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.account a username or email address
 * @param {string} [argv.domainFilter] a domain by which to filter the results
 * (default: all domains)
 * @param {boolean} [argv.truncate] truncate the results to only include the
 * name of each breach (default: true)
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export const handler = async ({
  account,
  domainFilter: domain,
  truncate,
  raw,
}: SearchHandlerOptions): Promise<void> => {
  if (!raw) {
    spinner.start();
  }

  try {
    const searchData = await search(account, {
      apiKey: config.get('apiKey'),
      domain,
      truncate,
      userAgent,
    });
    const foundData = !!(searchData.breaches || searchData.pastes);
    if (foundData && raw) {
      logger.log(JSON.stringify(searchData));
    } else if (foundData) {
      spinner.stop();
      logger.log(prettyjson.render(searchData));
    } else if (!foundData && !raw) {
      spinner.succeed('Good news — no pwnage found!');
    }
  } catch (err) {
    const errMsg = translateApiError(err.message);
    if (!raw) {
      spinner.fail(errMsg);
    } else {
      logger.error(errMsg);
    }
  }
};
