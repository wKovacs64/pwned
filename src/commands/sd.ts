import type { Argv } from 'yargs';
import { subscribedDomains } from 'hibp';
import prettyjson from 'prettyjson';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';
import { translateApiError } from '../utils/translate-api-error.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'sd';
export const describe = 'get all subscribed domains for your account';

interface SdArgvOptions {
  r?: boolean;
}

interface SdHandlerOptions {
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<SdArgvOptions>): Argv<SdHandlerOptions> {
  return yargs
    .option('r', {
      alias: 'raw',
      describe: 'output the raw JSON data (or an empty array, if no results found)',
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
 * Fetches and outputs subscribed domains for your account.
 *
 * @param {object} argv the parsed argv object
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ raw }: SdHandlerOptions): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const domainsData = await subscribedDomains({
      apiKey: config.get('apiKey'),
      userAgent,
    });
    if (domainsData.length && raw) {
      logger.log(JSON.stringify(domainsData));
    } else if (domainsData.length) {
      spinner.stop();
      logger.log(prettyjson.render(domainsData));
    } else if (!domainsData.length && !raw) {
      spinner.succeed('No subscribed domains found.');
    }
  } catch (maybeError) {
    /* v8 ignore else -- @preserve */
    if (maybeError instanceof Error) {
      const errorMessage = translateApiError(maybeError.message);
      if (!raw) {
        spinner.fail(errorMessage);
      } else {
        logger.error(errorMessage);
      }
    }
  }
}
