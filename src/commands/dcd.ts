import type { Argv } from "yargs";
import { dataClassDescriptions } from "hibp";
import prettyjson from "prettyjson";
import { logger } from "../utils/logger.js";
import { spinner } from "../utils/spinner.js";
import { userAgent } from "../utils/user-agent.js";

export const command = "dcd";
export const describe = "get all data classes in the system with descriptions";

interface DcdArgvOptions {
  r?: boolean;
}

interface DcdHandlerOptions {
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<DcdArgvOptions>): Argv<DcdHandlerOptions> {
  return yargs
    .option("r", {
      describe: "output the raw JSON data",
      type: "boolean",
      default: false,
    })
    .alias("r", "raw")
    .group(["r"], "Command Options:")
    .group(["h", "v"], "Global Options:");
}

/**
 * Fetches and outputs all data classes in the system with their descriptions.
 *
 * @param {object} argv the parsed argv object
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({
  raw = false,
}: DcdHandlerOptions): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const descriptionsData = await dataClassDescriptions({ userAgent });

    if (Array.isArray(descriptionsData) && descriptionsData.length > 0) {
      if (raw) {
        logger.log(JSON.stringify(descriptionsData));
      } else {
        spinner.stop();
        logger.log(prettyjson.render(descriptionsData));
      }
    } else if (!raw) {
      throw new Error(
        "No data classes found. This is unexpected - the remote API may be having difficulties.",
      );
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
