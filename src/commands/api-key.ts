import type { Argv } from 'yargs';
import prompts from 'prompts';
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
    const promptResponse = await prompts({
      type: 'password',
      name: 'apiKeyFromPrompt',
      message: 'Enter your API key (input will be masked for your security)',
      validate: (value: string) =>
        value.length > 0 ? true : 'API key must be a non-empty string of characters.',
    });

    apiKey = promptResponse.apiKeyFromPrompt;
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
  } catch (err) {
    /* v8 ignore else -- @preserve */
    if (err instanceof Error) {
      logger.error(err.message);
    }
  }
}
