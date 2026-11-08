import { createHash } from "node:crypto";
import type { Argv } from "yargs";
import { breachedAccountRange } from "hibp";
import prettyjson from "prettyjson";
import { config } from "../config.js";
import { apiKeyEpilog } from "../utils/api-key-epilog.js";
import { logger } from "../utils/logger.js";
import { spinner } from "../utils/spinner.js";
import { translateApiError } from "../utils/translate-api-error.js";
import { userAgent } from "../utils/user-agent.js";

export const command = "bar <email>";

export const describe =
  "get all breaches for an email address using k-anonymity";

const PREFIX_LENGTH = 6;

interface BarArgvOptions {
  email: string;
  r?: boolean;
}

interface BarHandlerOptions {
  email: string;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<BarArgvOptions>): Argv<BarHandlerOptions> {
  return yargs
    .positional("email", {
      type: "string",
    })
    .demandOption("email")
    .check((argv) => {
      if (argv.email.length === 0) {
        throw new Error("The email argument must not be empty.");
      }

      return true;
    })
    .option("r", {
      alias: "raw",
      describe: "output the raw JSON data (or nothing, if no results found)",
      type: "boolean",
      default: false,
    })
    .group(["r"], "Command Options:")
    .group(["h", "v"], "Global Options:")
    .epilog(apiKeyEpilog("Pro", "High RPM"));
}

/**
 * Fetches and outputs breach names for an email address using its SHA-1 hash
 * prefix. Other accounts in the returned range are discarded, as required by
 * the haveibeenpwned.com terms of use.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.email the email address to query
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 * @see https://haveibeenpwned.com/API/v3#BreachesForHashRange
 */
export async function handler({
  email,
  raw = false,
}: BarHandlerOptions): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const emailHash = createHash("sha1")
      .update(email.trim().toLowerCase())
      .digest("hex")
      .toUpperCase();

    const rangeData = await breachedAccountRange(
      emailHash.slice(0, PREFIX_LENGTH),
      { apiKey: config.get("apiKey"), userAgent },
    );

    const breachData = rangeData
      ?.find(
        ({ hashSuffix }) =>
          hashSuffix.toUpperCase() === emailHash.slice(PREFIX_LENGTH),
      )
      ?.websites.map((Name) => ({ Name }));

    if (breachData && raw) {
      logger.log(JSON.stringify(breachData));
    } else if (breachData) {
      spinner.stop();
      logger.log(prettyjson.render(breachData));
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
