import { Argv, CommandBuilder } from 'yargs';
import { pwnedPassword } from 'hibp';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export const command = 'pw <password>';
export const describe = 'securely check a password for public exposure';

interface PwArgvOptions {
  password: string;
  r?: boolean;
}

interface PwHandlerOptions {
  password: string;
  raw?: boolean;
}

export const builder: CommandBuilder<
  PwArgvOptions,
  PwHandlerOptions
> /* istanbul ignore next */ = (
  yargs: Argv<PwArgvOptions>,
): Argv<PwHandlerOptions> =>
  yargs
    .positional('password', {
      type: 'string',
    })
    .check(argv => {
      if (!argv.password.length) {
        throw new Error('The password argument must not be empty.');
      }
      return true;
    })
    .option('r', {
      alias: 'raw',
      describe: 'disable the console spinner',
      type: 'boolean',
      default: false,
    })
    .group(['r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');

/**
 * Securely fetches the number of times the given password has been exposed in a
 * breach.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.password a password (plain text)
 * @param {boolean} [argv.raw] disable the console spinner (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export const handler = async ({
  password,
  raw,
}: PwHandlerOptions): Promise<void> => {
  if (!raw) {
    spinner.start();
  }

  try {
    const pwnCount = await pwnedPassword(password);
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
  } catch (err) {
    if (!raw) {
      spinner.fail(err.message);
    } else {
      logger.error(err.message);
    }
  }
};
