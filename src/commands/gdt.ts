import type { Argv } from "yargs";
import { generateDnsToken } from "hibp";
import prettyjson from "prettyjson";
import { config } from "../config.js";
import { apiKeyEpilog } from "../utils/api-key-epilog.js";
import { logger } from "../utils/logger.js";
import { spinner } from "../utils/spinner.js";
import { translateApiError } from "../utils/translate-api-error.js";
import { userAgent } from "../utils/user-agent.js";

export const command = "gdt <domain>";
export const describe = "generate a DNS TXT record value to verify a domain";

interface GdtArgvOptions {
  domain: string;
  r?: boolean;
}

interface GdtHandlerOptions {
  domain: string;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<GdtArgvOptions>): Argv<GdtHandlerOptions> {
  return yargs
    .positional("domain", {
      type: "string",
    })
    .demandOption("domain")
    .check((argv) => {
      if (!argv.domain.length) {
        throw new Error("The domain argument must not be empty.");
      }
      return true;
    })
    .option("r", {
      alias: "raw",
      describe: "output the raw JSON data",
      type: "boolean",
      default: false,
    })
    .group(["r"], "Command Options:")
    .group(["h", "v"], "Global Options:")
    .epilog(apiKeyEpilog("Pro"));
}

/**
 * Generates and outputs a DNS TXT record value to verify a domain.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.domain the domain to verify
 * @param {boolean} [argv.raw] output the raw JSON data (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({
  domain,
  raw,
}: GdtHandlerOptions): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const dnsTokenData = await generateDnsToken(domain.trim(), {
      apiKey: config.get("apiKey"),
      userAgent,
    });
    if (raw) {
      logger.log(JSON.stringify(dnsTokenData));
    } else {
      spinner.stop();
      logger.log(prettyjson.render(dnsTokenData));
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
