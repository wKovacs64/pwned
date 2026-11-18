import type { Argv } from "yargs";
import { breaches } from "hibp";
import prettyjson from "prettyjson";
import type { HandlerOptions } from "../utils/handler-options.js";
import { logger } from "../utils/logger.js";
import { spinner } from "../utils/spinner.js";
import { userAgent } from "../utils/user-agent.js";

export const command = "breaches";
export const describe = "get all breaches in the system";

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv) {
  return yargs
    .option("domain-filter", {
      alias: "d",
      describe: "filter breach data by domain",
      type: "string",
    })
    .option("spam-list", {
      alias: "s",
      describe:
        "only spam list breaches (--no-spam-list to exclude them instead)",
      type: "boolean",
    })
    .option("raw", {
      alias: "r",
      describe: "output the raw JSON data (or nothing, if no results found)",
      type: "boolean",
      default: false,
    })
    .group(["domain-filter", "spam-list", "raw"], "Command Options:")
    .group(["h", "v"], "Global Options:");
}

/**
 * Fetches and outputs all breached sites in the system.
 *
 * @param {object} argv the parsed argv object
 * @param {string} [argv.domainFilter] a domain by which to filter the results
 * (default: all domains)
 * @param {boolean} [argv.spamList] true for only spam list breaches, false for
 * only non-spam list breaches (default: no spam list filter)
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({
  domainFilter: domain,
  spamList: isSpamList,
  raw,
}: HandlerOptions<typeof builder>): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const breachData = await breaches({ domain, isSpamList, userAgent });

    if (breachData.length > 0 && raw) {
      logger.log(JSON.stringify(breachData));
    } else if (breachData.length > 0) {
      spinner.stop();
      logger.log(prettyjson.render(breachData));
    } else if (!raw) {
      spinner.succeed("No breaches found.");
    }
  } catch (maybeError) {
    /* v8 ignore else -- @preserve */
    if (maybeError instanceof Error) {
      process.exitCode = 1;

      if (!raw) {
        spinner.fail(maybeError.message);
      } else {
        logger.error(maybeError.message);
      }
    }
  }
}
