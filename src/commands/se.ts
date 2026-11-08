import type { Argv } from "yargs";
import { sendEmail, type EmailAlias } from "hibp";
import { config } from "../config.js";
import { apiKeyEpilog } from "../utils/api-key-epilog.js";
import { logger } from "../utils/logger.js";
import { spinner } from "../utils/spinner.js";
import { translateApiError } from "../utils/translate-api-error.js";
import { userAgent } from "../utils/user-agent.js";

export const command = "se <domain> <alias>";
export const describe = "send a domain verification approval email";

const EMAIL_ALIASES = [
  "admin",
  "hostmaster",
  "info",
  "security",
  "webmaster",
] as const satisfies readonly EmailAlias[];

interface SeArgvOptions {
  domain: string;
  alias: EmailAlias;
  r?: boolean;
}

interface SeHandlerOptions {
  domain: string;
  alias: EmailAlias;
  raw?: boolean;
}

/* v8 ignore next -- @preserve */
export function builder(yargs: Argv<SeArgvOptions>): Argv<SeHandlerOptions> {
  return yargs
    .positional("domain", {
      type: "string",
    })
    .positional("alias", {
      choices: EMAIL_ALIASES,
    })
    .demandOption(["domain", "alias"])
    .check((argv) => {
      if (argv.domain.length === 0) {
        throw new Error("The domain argument must not be empty.");
      }

      return true;
    })
    .option("r", {
      alias: "raw",
      describe: "disable the console spinner",
      type: "boolean",
      default: false,
    })
    .group(["r"], "Command Options:")
    .group(["h", "v"], "Global Options:")
    .epilog(apiKeyEpilog("Pro"));
}

/**
 * Requests a domain verification approval email. The domain is verified once
 * the link in the email is followed.
 *
 * @param {object} argv the parsed argv object
 * @param {string} argv.domain the domain to verify
 * @param {string} argv.alias the administrative alias to receive the email
 * @param {boolean} [argv.raw] disable the console spinner (default: false)
 * @returns {Promise<void>} the resulting Promise where output is rendered
 */
export async function handler({
  domain,
  alias,
  raw = false,
}: SeHandlerOptions): Promise<void> {
  if (!raw) {
    spinner.start();
  }

  try {
    const trimmedDomain = domain.trim();
    await sendEmail(trimmedDomain, alias, {
      apiKey: config.get("apiKey"),
      userAgent,
    });
    const successMessage = `Sent an approval email to ${alias}@${trimmedDomain}.`;

    if (!raw) {
      spinner.succeed(successMessage);
    } else {
      logger.log(successMessage);
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
