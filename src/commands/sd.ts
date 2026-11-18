import type { Argv } from "yargs";
import { subscribedDomains } from "hibp";
import prettyjson from "prettyjson";
import { config } from "../config.js";
import { apiKeyEpilog } from "../utils/api-key-epilog.js";
import type { HandlerOptions } from "../utils/handler-options.js";
import { logger } from "../utils/logger.js";
import { spinner } from "../utils/spinner.js";
import { translateApiError } from "../utils/translate-api-error.js";
import { userAgent } from "../utils/user-agent.js";

export const command = "sd";
export const describe = "get all subscribed domains for your account";

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv) {
  return yargs
    .option("raw", {
      alias: "r",
      describe:
        "output the raw JSON data (or an empty array, if no results found)",
      type: "boolean",
      default: false,
    })
    .group(["raw"], "Command Options:")
    .group(["h", "v"], "Global Options:")
    .epilog(apiKeyEpilog("Core", "Pro"));
}

/**
 * Fetches and outputs subscribed domains for your account.
 *
 * @param {object} argv the parsed argv object
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({
  raw,
}: HandlerOptions<typeof builder>): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const domainsData = await subscribedDomains({
      apiKey: config.get("apiKey"),
      userAgent,
    });

    if (domainsData.length > 0 && raw) {
      logger.log(JSON.stringify(domainsData));
    } else if (domainsData.length > 0) {
      spinner.stop();
      logger.log(prettyjson.render(domainsData));
    } else if (!raw) {
      spinner.succeed("No subscribed domains found.");
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
