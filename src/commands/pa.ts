import { Argv, CommandBuilder } from 'yargs';
import { pasteAccount } from 'hibp';
import prettyjson from 'prettyjson';
import { oneLine } from 'common-tags';
import config from '../utils/config';
import translateApiError from '../utils/translateApiError';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import userAgent from '../utils/ua';

export const command = 'pa <email>';
export const describe = 'get all pastes for an account (email address)';

interface PaArgvOptions {
  email: string;
  r?: boolean;
}

interface PaHandlerOptions {
  email: string;
  raw?: boolean;
}

export const builder: CommandBuilder<
  PaArgvOptions,
  PaHandlerOptions
> /* istanbul ignore next */ = (yargs): Argv<PaHandlerOptions> =>
  yargs
    .positional('email', {
      type: 'string',
    })
    .demandOption('email')
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
    .group(['h', 'v'], 'Global Options:').epilog(oneLine`
      🔑 This command requires an API key. Make sure you've run the "apiKey"
      command first.
    `);

/**
 * Fetches and outputs all pastes for an account (email address).
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.email the email address to query
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export const handler = async ({
  email,
  raw,
}: PaHandlerOptions): Promise<void> => {
  if (!raw) {
    spinner.start();
  }

  try {
    const pasteData = await pasteAccount(email, {
      apiKey: config.get('apiKey'),
      userAgent,
    });
    if (pasteData && raw) {
      logger.log(JSON.stringify(pasteData));
    } else if (pasteData) {
      spinner.stop();
      logger.log(prettyjson.render(pasteData));
    } else if (!pasteData && !raw) {
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
