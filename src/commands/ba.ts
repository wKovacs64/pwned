import { Argv, Omit } from 'yargs';
import { breachedAccount } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'ba <account|email>';
export const describe =
  'get all breaches for an account (username or email address)';

interface BaArgvOptions {
  account: string;
  d?: string;
  t?: boolean;
  r?: boolean;
}

type BaBuilder = Argv<
  Omit<
    Omit<Omit<BaArgvOptions, 'd'> & { d: string | undefined }, 't'> & {
      t: boolean;
    },
    'r'
  > & { r: boolean }
>;

export const builder /* istanbul ignore next */ = (
  yargs: Argv<BaArgvOptions>,
): BaBuilder =>
  yargs
    .positional('account', {
      alias: 'email',
      type: 'string',
    })
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

interface BaHandlerOptions {
  account: string;
  domainFilter?: string;
  truncate?: boolean;
  raw?: boolean;
}

/**
 * Fetches and outputs breach data for the specified account.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.account a username or email address
 * @param {string} [argv.domainFilter] a domain by which to filter the results
 * (default: all domains)
 * @param {boolean} [argv.truncate] truncate the results to only include the
 * name of each breach (default: false)
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export const handler = async ({
  account,
  domainFilter: domain,
  truncate,
  raw,
}: BaHandlerOptions): Promise<void> => {
  if (!raw) {
    spinner.start();
  }

  try {
    const breachData = await breachedAccount(account.trim(), {
      domain,
      truncate,
    });
    if (breachData && raw) {
      logger.log(JSON.stringify(breachData));
    } else if (breachData) {
      spinner.stop();
      logger.log(prettyjson.render(breachData));
    } else if (!breachData && !raw) {
      spinner.succeed('Good news — no pwnage found!');
    }
  } catch (err) {
    if (!raw) {
      spinner.fail(err.message);
    } else {
      logger.error(err.message);
    }
  }
};
