import type { Argv } from 'yargs';
import { breach } from 'hibp';
import prettyjson from 'prettyjson';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'breach <name>';
export const describe = 'get a single breached site by breach name';

interface BreachArgvOptions {
  name: string;
  r?: boolean;
}

interface BreachHandlerOptions {
  name: string;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<BreachArgvOptions>): Argv<BreachHandlerOptions> {
  return yargs
    .positional('name', {
      type: 'string',
    })
    .demandOption('name')
    .check((argv) => {
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
}

/**
 * Fetches and outputs breach data for a single site by breach name.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.name the name of a breach in the system
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ name, raw }: BreachHandlerOptions): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const breachData = await breach(name, { userAgent });
    if (breachData && raw) {
      logger.log(JSON.stringify(breachData));
    } else if (breachData) {
      spinner.stop();
      logger.log(prettyjson.render(breachData));
    } else if (!raw) {
      spinner.succeed('No breach found by that name.');
    }
  } catch (maybeError) {
    /* v8 ignore else -- @preserve */
    if (maybeError instanceof Error) {
      process.exitCode = 1;
      if (!raw) {
        spinner.fail(maybeError.message);
      } else {
        logger.error(maybeError.message);
      }
    }
  }
}
