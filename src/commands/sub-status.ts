import type { Argv } from "yargs";
import { subscriptionStatus } from "hibp";
import prettyjson from "prettyjson";
import { config } from "../config.js";
import { apiKeyEpilog } from "../utils/api-key-epilog.js";
import type { HandlerOptions } from "../utils/handler-options.js";
import { logger } from "../utils/logger.js";
import { spinner } from "../utils/spinner.js";
import { translateApiError } from "../utils/translate-api-error.js";
import { userAgent } from "../utils/user-agent.js";

export const command = "subStatus";
export const describe = "get the subscription status of your API key";

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv) {
  return yargs
    .option("raw", {
      alias: "r",
      describe: "output the raw JSON data",
      type: "boolean",
      default: false,
    })
    .group(["raw"], "Command Options:")
    .group(["h", "v"], "Global Options:")
    .epilog(apiKeyEpilog("Core", "Pro", "High RPM"));
}

/**
 * Fetches and outputs your subscription status (of your API key).
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
    const subStatusData = await subscriptionStatus({
      apiKey: config.get("apiKey"),
      userAgent,
    });

    if (raw) {
      logger.log(JSON.stringify(subStatusData));
    } else {
      spinner.stop();
      logger.log(prettyjson.render(subStatusData));
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
