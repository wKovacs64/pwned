import { beforeEach, describe, expect, it } from "vitest";
import { http } from "msw/http";
import { server } from "../../../test/server.js";
import { stubOutput } from "../../../test/stub-output.js";
import {
  spinnerFns,
  loggerFns,
  DNS_TOKEN,
  FOUND,
  ERROR,
  ERROR_MSG,
} from "../../../test/fixtures.js";
import { handler as gdt } from "../gdt.js";

const { logger, spinner } = stubOutput();

describe("command: gdt", () => {
  describe("normal output (default)", () => {
    it("calls spinner.start", async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await gdt({ domain: FOUND, raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it("on success: calls spinner.stop and logger.log", async () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      expect(logger.log).toHaveBeenCalledTimes(0);
      await gdt({ domain: FOUND, raw: false });
      expect(spinner.stop).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it("on error: only calls spinner.fail", async () => {
      server.use(
        http.post("*", () => {
          throw new Error(ERROR_MSG);
        }),
      );

      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await gdt({ domain: ERROR, raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe("raw mode", () => {
    it("does not call spinner.start", async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await gdt({ domain: FOUND, raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it("on success: only calls logger.log", async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await gdt({ domain: FOUND, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledWith(JSON.stringify(DNS_TOKEN));
    });

    it("on error: only calls logger.error", async () => {
      server.use(
        http.post("*", () => {
          throw new Error(ERROR_MSG);
        }),
      );

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await gdt({ domain: ERROR, raw: true });
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
        http.post("*", () => {
          throw new Error(ERROR_MSG);
        }),
      );

      expect(process.exitCode).toBeUndefined();
      await gdt({ domain: ERROR, raw: false });
      expect(process.exitCode).toBe(1);
    });

    it("does not set exit code on success", async () => {
      expect(process.exitCode).toBeUndefined();
      await gdt({ domain: FOUND, raw: false });
      expect(process.exitCode).toBeUndefined();
    });
  });
});
