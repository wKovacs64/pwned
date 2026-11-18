import type { Argv } from "yargs";
import { stealerLogsByEmailDomain } from "hibp";
import prettyjson from "prettyjson";
import { config } from "../config.js";
import { apiKeyEpilog } from "../utils/api-key-epilog.js";
import type { HandlerOptions } from "../utils/handler-options.js";
import { logger } from "../utils/logger.js";
import { spinner } from "../utils/spinner.js";
import { translateApiError } from "../utils/translate-api-error.js";
import { userAgent } from "../utils/user-agent.js";

export const command = "slbed <email-domain>";
export const describe = "get all stealer log email aliases for an email domain";

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv) {
  return yargs
    .positional("email-domain", {
      type: "string",
    })
    .demandOption("email-domain")
    .check((argv) => {
      if (argv["email-domain"].length === 0) {
        throw new Error("The email-domain argument must not be empty.");
      }

      return true;
    })
    .option("raw", {
      alias: "r",
      describe: "output the raw JSON data (or nothing, if no results found)",
      type: "boolean",
      default: false,
    })
    .group(["raw"], "Command Options:")
    .group(["h", "v"], "Global Options:")
    .epilog(apiKeyEpilog("Pro"));
}

/**
 * Fetches and outputs stealer log email aliases for an email domain.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.emailDomain the email domain to query
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({
  emailDomain,
  raw,
}: HandlerOptions<typeof builder>): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const logsData = await stealerLogsByEmailDomain(emailDomain.trim(), {
      apiKey: config.get("apiKey"),
      userAgent,
    });

    if (logsData && raw) {
      logger.log(JSON.stringify(logsData));
    } else if (logsData) {
      spinner.stop();
      logger.log(prettyjson.render(logsData));
    } else if (!raw) {
      spinner.succeed("Good news — no stealer logs found!");
    }
  } catch (maybeError) {
    /* v8 ignore else -- @preserve */
    if (maybeError instanceof Error) {
      process.exitCode = 1;
      const errorMessage = translateApiError(maybeError.message);

      if (!raw) {
        spinner.fail(errorMessage);
      } else {
        logger.error(errorMessage);
      }
    }
  }
}
