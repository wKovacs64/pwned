import type { Argv } from 'yargs';
import { pasteAccount } from 'hibp';
import { oneLine } from 'common-tags';
import { config } from '../config.js';
import { runCommand } from '../utils/run-command.js';
import { userAgent } from '../utils/user-agent.js';

export const command = 'pa <email>';
export const describe = 'get all pastes for an account (email address)';

interface PaArgvOptions {
  email: string;
  r?: boolean;
}

interface PaHandlerOptions {
  email: string;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<PaArgvOptions>): Argv<PaHandlerOptions> {
  return yargs
    .positional('email', {
      type: 'string',
    })
    .demandOption('email')
    .check((argv) => {
      if (!argv.email.length) {
        throw new Error('The email argument must not be empty.');
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
 * Fetches and outputs all pastes for an account (email address).
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.email the email address to query
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({ email, raw }: PaHandlerOptions): Promise<void> {
  return runCommand({
    raw: Boolean(raw),
    fetchData: () =>
      pasteAccount(email, {
        apiKey: config.get('apiKey'),
        userAgent,
      }),
    hasData: (data) => data !== null,
    noDataMessage: 'Good news — no pwnage found!',
  });
}
