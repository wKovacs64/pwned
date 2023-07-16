import type { Argv } from 'yargs';
import { pasteAccount } from 'hibp';
import prettyjson from 'prettyjson';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';
import { translateApiError } from '../utils/translate-api-error.js';
import { userAgent } from '../utils/user-agent.js';

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

/* c8 ignore start */
export function builder(yargs: Argv<PaArgvOptions>): Argv<PaHandlerOptions> {
  return yargs
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
}
/* c8 ignore stop */

/**
 * Fetches and outputs all pastes for an account (email address).
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.email the email address to query
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ email, raw }: PaHandlerOptions): Promise<void> {
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
    } else if (!raw) {
      spinner.succeed('Good news — no pwnage found!');
    }
  } catch (err: unknown) {
    /* c8 ignore else */
    if (err instanceof Error) {
      const errMsg = translateApiError(err.message);
      if (!raw) {
        spinner.fail(errMsg);
      } else {
        logger.error(errMsg);
      }
    }
  }
}
