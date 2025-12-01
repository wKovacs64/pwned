import type { Argv } from 'yargs';
import { stealerLogsByEmail } from 'hibp';
import prettyjson from 'prettyjson';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';
import { translateApiError } from '../utils/translate-api-error.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'slbe <email>';
export const describe = 'get all stealer log domains for an email address';

interface SlbeArgvOptions {
  email: string;
  r?: boolean;
}

interface SlbeHandlerOptions {
  email: string;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<SlbeArgvOptions>): Argv<SlbeHandlerOptions> {
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

/**
 * Fetches and outputs stealer log domains for an email address.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.email the email address to query
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ email, raw }: SlbeHandlerOptions): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const domainsData = await stealerLogsByEmail(email.trim(), {
      apiKey: config.get('apiKey'),
      userAgent,
    });
    if (domainsData && raw) {
      logger.log(JSON.stringify(domainsData));
    } else if (domainsData) {
      spinner.stop();
      logger.log(prettyjson.render(domainsData));
    } else if (!raw) {
      spinner.succeed('Good news — no stealer logs found!');
    }
  } catch (maybeError) {
    /* v8 ignore else -- @preserve */
    if (maybeError instanceof Error) {
      process.exitCode = 1;
      const errorMessage = translateApiError(maybeError.message);
      if (!raw) {
        spinner.fail(errorMessage);
      } else {
        logger.error(errorMessage);
      }
    }
  }
}
