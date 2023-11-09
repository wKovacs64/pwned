import type { Argv } from 'yargs';
import { pwnedPassword } from 'hibp';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'pw <password>';
export const describe = 'securely check a password for public exposure';

interface PwArgvOptions {
  password: string;
  p?: boolean;
  r?: boolean;
}

interface PwHandlerOptions {
  password: string;
  pad?: boolean;
  raw?: boolean;
}

/* c8 ignore start */
export function builder(yargs: Argv<PwArgvOptions>): Argv<PwHandlerOptions> {
  return yargs
    .positional('password', {
      type: 'string',
    })
    .demand('password')
    .check((argv) => {
      if (!argv.password.length) {
        throw new Error('The password argument must not be empty.');
      }
      return true;
    })
    .option('p', {
      alias: 'pad',
      describe: 'add padding to the API response to obscure the contents',
      type: 'boolean',
      default: false,
    })
    .option('r', {
      alias: 'raw',
      describe: 'disable the console spinner',
      type: 'boolean',
      default: false,
    })
    .group(['r', 'p'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');
}
/* c8 ignore stop */

/**
 * Securely fetches the number of times the given password has been exposed in a
 * breach.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.password a password (plain text)
 * @param {boolean} [argv.raw] disable the console spinner (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({
  password,
  pad,
  raw,
}: PwHandlerOptions): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const pwnCount = await pwnedPassword(password, {
      userAgent,
      addPadding: pad,
    });
    if (pwnCount) {
      const pwnedMessage = `Oh no — pwned ${pwnCount} times!`;
      if (!raw) {
        spinner.warn(pwnedMessage);
      } else {
        logger.log(pwnedMessage);
      }
    } else {
      const successMessage = 'Good news — no pwnage found!';
      if (!raw) {
        spinner.succeed(successMessage);
      } else {
        logger.log(successMessage);
      }
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
