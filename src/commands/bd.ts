import type { Argv } from 'yargs';
import { breachedDomain } from 'hibp';
import prettyjson from 'prettyjson';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';
import { translateApiError } from '../utils/translate-api-error.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'bd <domain>';
export const describe = 'get all breached email addresses for a domain';

interface BdArgvOptions {
  domain: string;
  r?: boolean;
}

interface BdHandlerOptions {
  domain: string;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<BdArgvOptions>): Argv<BdHandlerOptions> {
  return yargs
    .positional('domain', {
      type: 'string',
    })
    .demandOption('domain')
    .check((argv) => {
      if (!argv.domain.length) {
        throw new Error('The domain argument must not be empty.');
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
 * Fetches and outputs breached email addresses for a domain.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.domain the domain to query
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ domain, raw }: BdHandlerOptions): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const breachData = await breachedDomain(domain.trim(), {
      apiKey: config.get('apiKey'),
      userAgent,
    });
    if (breachData && raw) {
      logger.log(JSON.stringify(breachData));
    } else if (breachData) {
      spinner.stop();
      logger.log(prettyjson.render(breachData));
    } else if (!raw) {
      spinner.succeed('Good news — no pwnage found!');
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
