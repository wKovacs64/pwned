import type { Argv } from 'yargs';
import { subscriptionStatus } from 'hibp';
import prettyjson from 'prettyjson';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'subStatus';
export const describe = 'get your subscription status';

interface SubStatusArgvOptions {
  r?: boolean;
}

interface SubStatusHandlerOptions {
  raw?: boolean;
}

/* c8 ignore start */
export function builder(
  yargs: Argv<SubStatusArgvOptions>,
): Argv<SubStatusHandlerOptions> {
  return yargs
    .option('r', {
      describe: 'output the raw JSON data',
      type: 'boolean',
      default: false,
    })
    .alias('r', 'raw')
    .group(['r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');
}
/* c8 ignore stop */

/**
 * Fetches and outputs your subscription status (of your API key).
 *
 * @param {object} argv the parsed argv object
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ raw }: SubStatusHandlerOptions): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const subStatusData = await subscriptionStatus({
      apiKey: config.get('apiKey'),
      userAgent,
    });
    if (raw) {
      logger.log(JSON.stringify(subStatusData));
    } else {
      spinner.stop();
      logger.log(prettyjson.render(subStatusData));
    }
  } catch (err: unknown) {
    /* c8 ignore else */
    if (err instanceof Error) {
      if (!raw) {
        spinner.fail(err.message);
      } else {
        logger.error(err.message);
      }
    }
  }
}
