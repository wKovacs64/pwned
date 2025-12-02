import type { Argv } from 'yargs';
import { password } from '@inquirer/prompts';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export const command = 'apiKey [key]';
export const describe = 'set the API key to be used for authenticated requests';

interface ApiKeyArgvOptions {
  key?: string;
}

interface ApiKeyHandlerOptions {
  key?: string;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<ApiKeyArgvOptions>): Argv<ApiKeyHandlerOptions> {
  return yargs.positional('key', { type: 'string' }).group(['h', 'v'], 'Global Options:')
    .epilog(oneLine`
      Please obtain an API key from https://haveibeenpwned.com/API/Key and then
      run "pwned apiKey" to configure pwned.
    `);
}

/**
 * Stores the user's specified API key to be used for future requests to
 * authenticated endpoints.
 *
 * @param {object} argv the parsed argv object
 * @param {string} [argv.key] the user's API key
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ key }: ApiKeyHandlerOptions) {
  let apiKey = key;
  if (!apiKey) {
    try {
      apiKey = await password({
        message: 'Enter your API key (input will be masked for your security)',
        validate: (value: string) =>
          value.length > 0 ? true : 'API key must be a non-empty string of characters.',
      });
    } catch (maybeError) {
      /* v8 ignore else -- @preserve */
      if (maybeError instanceof Error) {
        if (maybeError.name === 'ExitPromptError') {
          process.exit(1);
        }
        throw maybeError;
      }
    }
  }

  try {
    if (!apiKey) {
      throw new Error('✖ API key must be a non-empty string of characters.');
    }
    config.set('apiKey', apiKey);
    if (config.get('apiKey') === apiKey) {
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
  } catch (maybeError) {
    /* v8 ignore else -- @preserve */
    if (maybeError instanceof Error) {
      process.exitCode = 1;
      logger.error(maybeError.message);
    }
  }
}
