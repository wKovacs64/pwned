import type { Argv } from 'yargs';
import { stealerLogsByEmailDomain } from 'hibp';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { runCommand } from '../utils/run-command.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'slbed <email-domain>';
export const describe = 'get all stealer log email aliases for an email domain';

interface SlbedArgvOptions {
  emailDomain: string;
  r?: boolean;
}

interface SlbedHandlerOptions {
  emailDomain: string;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<SlbedArgvOptions>): Argv<SlbedHandlerOptions> {
  return yargs
    .positional('email-domain', {
      type: 'string',
    })
    .demandOption('email-domain')
    .check((argv) => {
      if (!argv.emailDomain.length) {
        throw new Error('The email-domain argument must not be empty.');
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
 * Fetches and outputs stealer log email aliases for an email domain.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.emailDomain the email domain to query
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ emailDomain, raw }: SlbedHandlerOptions): Promise<void> {
  return runCommand({
    raw: Boolean(raw),
    fetchData: () =>
      stealerLogsByEmailDomain(emailDomain.trim(), {
        apiKey: config.get('apiKey'),
        userAgent,
      }),
    hasData: (data) => data !== null,
    noDataMessage: 'Good news — no stealer logs found!',
  });
}
