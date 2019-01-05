import { Argv, Omit } from 'yargs';
import { breach } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'breach <name>';
export const describe = 'get a single breached site by breach name';

interface BreachArgvOptions {
  name: string;
  r?: boolean;
}

type BreachBuilder = Argv<Omit<BreachArgvOptions, 'r'> & { r: boolean }>;

export const builder /* istanbul ignore next */ = (
  yargs: Argv<BreachArgvOptions>,
): BreachBuilder =>
  yargs
    .positional('name', {
      type: 'string',
    })
    .check(argv => {
      if (!argv.name.length) {
        throw new Error('The name argument must not be empty.');
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

interface BreachHandlerOptions {
  name: string;
  raw?: boolean;
}

/**
 * Fetches and outputs breach data for a single site by breach name.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.name the name of a breach in the system
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export const handler = async ({
  name,
  raw,
}: BreachHandlerOptions): Promise<void> => {
  if (!raw) {
    spinner.start();
  }

  try {
    const breachData = await breach(name);
    if (breachData && raw) {
      logger.log(JSON.stringify(breachData));
    } else if (breachData) {
      spinner.stop();
      logger.log(prettyjson.render(breachData));
    } else if (!breachData && !raw) {
      spinner.succeed('No breach found by that name.');
    }
  } catch (err) {
    if (!raw) {
      spinner.fail(err.message);
    } else {
      logger.error(err.message);
    }
  }
};
