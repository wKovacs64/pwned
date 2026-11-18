import type { Argv } from "yargs";
import { search } from "hibp";
import prettyjson from "prettyjson";
import { config } from "../config.js";
import { apiKeyEpilog } from "../utils/api-key-epilog.js";
import type { HandlerOptions } from "../utils/handler-options.js";
import { logger } from "../utils/logger.js";
import { spinner } from "../utils/spinner.js";
import { translateApiError } from "../utils/translate-api-error.js";
import { userAgent } from "../utils/user-agent.js";

export const command = "search <account|email>";

export const describe =
  "search breaches and pastes for an account (username or email address)";

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv) {
  return yargs
    .positional("account", {
      alias: "email",
      type: "string",
    })
    .demandOption("account")
    .check((argv) => {
      if (argv.account.length === 0) {
        throw new Error("The account argument must not be empty.");
      }

      return true;
    })
    .option("domain-filter", {
      alias: "d",
      describe: "filter breach data by domain",
      type: "string",
    })
    .option("truncate", {
      alias: "t",
      describe: "truncate data to just the name of each breach",
      type: "boolean",
      default: true,
    })
    .option("raw", {
      alias: "r",
      describe: "output the raw JSON data (or nothing, if no results found)",
      type: "boolean",
      default: false,
    })
    .group(["domain-filter", "truncate", "raw"], "Command Options:")
    .group(["h", "v"], "Global Options:")
    .epilog(apiKeyEpilog("Core", "Pro", "High RPM"));
}

/**
 * Fetches and outputs breach and paste data for the specified account.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.account a username or email address
 * @param {string} [argv.domainFilter] a domain by which to filter the results
 * (default: all domains)
 * @param {boolean} [argv.truncate] truncate the results to only include the
 * name of each breach (default: true)
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({
  account,
  domainFilter: domain,
  truncate,
  raw,
}: HandlerOptions<typeof builder>): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const searchData = await search(account, {
      apiKey: config.get("apiKey"),
      domain,
      truncate,
      userAgent,
    });

    const foundData = !!(searchData.breaches ?? searchData.pastes);

    if (foundData && raw) {
      logger.log(JSON.stringify(searchData));
    } else if (foundData) {
      spinner.stop();
      logger.log(prettyjson.render(searchData));
    } else if (!raw) {
      spinner.succeed("Good news — no pwnage found!");
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
