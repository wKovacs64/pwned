import type { Argv } from 'yargs';
import { oneLine } from 'common-tags';
import { config } from '../config';
import { logger } from '../utils';

export const command = 'apiKey <key>';
export const describe = 'set the API key to be used for authenticated requests';

interface ApiKeyArgvOptions {
  key: string;
}

interface ApiKeyHandlerOptions {
  key: string;
}

/* c8 ignore next */
export function builder(
  yargs: Argv<ApiKeyArgvOptions>,
): Argv<ApiKeyHandlerOptions> {
  return yargs
    .positional('key', { type: 'string' })
    .demandOption('key')
    .check((argv) => {
      if (!argv.key.length) {
        throw new Error('The key argument must not be empty.');
      }
      return true;
    })
    .group(['h', 'v'], 'Global Options:').epilog(oneLine`
      Please obtain an API key from https://haveibeenpwned.com/API/Key and then
      run "pwned apiKey <key>" to configure pwned.
    `);
}

/**
 * Stores the user's specified API key to be used for future requests to
 * authenticated endpoints.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.key the user's API key
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export function handler({ key }: ApiKeyHandlerOptions) {
  try {
    config.set('apiKey', key);
    if (config.get('apiKey') === key) {
      logger.log(oneLine`
        ✔ API key saved successfully. It will be used in future requests made
        to haveibeenpwned.com services that require authentication.
      `);
    } else {
      throw new Error(oneLine`
        ✖ API key mismatch: the key read back from config does not match the
        key supplied!
      `);
    }
  } catch (err: unknown) {
    /* c8 ignore else */
    if (err instanceof Error) {
      logger.error(err.message);
    }
  }
}
