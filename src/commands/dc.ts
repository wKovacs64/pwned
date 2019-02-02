import { Argv, CommandBuilder } from 'yargs';
import { dataClasses } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import userAgent from '../utils/ua';

export const command = 'dc';
export const describe = 'get all data classes in the system';

interface DcArgvOptions {
  r?: boolean;
}

interface DcHandlerOptions {
  raw?: boolean;
}

export const builder: CommandBuilder<
  DcArgvOptions,
  DcHandlerOptions
> /* istanbul ignore next */ = (yargs): Argv<DcHandlerOptions> =>
  yargs
    .option('r', {
      describe: 'output the raw JSON data',
      type: 'boolean',
      default: false,
    })
    .alias('r', 'raw')
    .group(['r'], 'Command Options:')
    .group(['h', 'v'], 'Global Options:');

/**
 * Fetches and outputs all data classes in the system.
 *
 * @param {object} argv the parsed argv object
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export const handler = async ({ raw }: DcHandlerOptions): Promise<void> => {
  if (!raw) {
    spinner.start();
  }

  try {
    const dataClassesData = await dataClasses({ userAgent });
    if (Array.isArray(dataClassesData) && dataClassesData.length) {
      if (raw) {
        logger.log(JSON.stringify(dataClassesData));
      } else {
        spinner.stop();
        logger.log(prettyjson.render(dataClassesData));
      }
    } else if (!raw) {
      throw new Error(
        'No data classes found. This is unexpected - the remote API may be having difficulties.',
      );
    }
  } catch (err) {
    if (!raw) {
      spinner.fail(err.message);
    } else {
      logger.error(err.message);
    }
  }
};
