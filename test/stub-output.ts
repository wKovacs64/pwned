import { vi } from "vitest";
import { logger } from "../src/utils/logger.js";
import { spinner } from "../src/utils/spinner.js";
import { loggerFns, spinnerFns } from "./fixtures.js";

/**
 * Replaces every logger and spinner method with a no-op spy so commands
 * produce no output and tests can assert on the calls.
 */
export function stubOutput() {
  for (const fn of loggerFns) {
    vi.spyOn(logger, fn).mockReturnValue(undefined);
  }

  for (const fn of spinnerFns) {
    vi.spyOn(spinner, fn).mockReturnThis();
  }

  return { logger: vi.mocked(logger), spinner: vi.mocked(spinner) };
}
