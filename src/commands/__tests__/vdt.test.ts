import { beforeEach, describe, expect, it } from "vitest";
import { http } from "msw/http";
import { server } from "../../../test/server.js";
import { stubOutput } from "../../../test/stub-output.js";
import {
  spinnerFns,
  loggerFns,
  FOUND,
  ERROR,
  ERROR_MSG,
} from "../../../test/fixtures.js";
import { handler as vdt } from "../vdt.js";

const { logger, spinner } = stubOutput();

describe("command: vdt", () => {
  describe("normal output (default)", () => {
    it("calls spinner.start", async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await vdt({ domain: FOUND, raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it("on success: only calls spinner.succeed", async () => {
      expect(spinner.succeed).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await vdt({ domain: FOUND, raw: false });
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it("on error: only calls spinner.fail", async () => {
      server.use(
        http.post("*/domainVerification/verifyDnsToken", () => {
          throw new Error(ERROR_MSG);
        }),
      );

      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await vdt({ domain: ERROR, raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe("raw mode", () => {
    it("does not call spinner.start", async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await vdt({ domain: FOUND, raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it("on success: only calls logger.log", async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await vdt({ domain: FOUND, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it("on error: only calls logger.error", async () => {
      server.use(
        http.post("*/domainVerification/verifyDnsToken", () => {
          throw new Error(ERROR_MSG);
        }),
      );

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await vdt({ domain: ERROR, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe("exit codes", () => {
    beforeEach(() => {
      process.exitCode = undefined;
    });

    it("sets exit code 1 on error", async () => {
      server.use(
        http.post("*/domainVerification/verifyDnsToken", () => {
          throw new Error(ERROR_MSG);
        }),
      );

      expect(process.exitCode).toBeUndefined();
      await vdt({ domain: ERROR, raw: false });
      expect(process.exitCode).toBe(1);
    });

    it("does not set exit code on success", async () => {
      expect(process.exitCode).toBeUndefined();
      await vdt({ domain: FOUND, raw: false });
      expect(process.exitCode).toBeUndefined();
    });
  });
});
