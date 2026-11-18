import { beforeEach, describe, expect, it } from "vitest";
import { http } from "msw/http";
import { server } from "../../../test/server.js";
import { stubOutput } from "../../../test/stub-output.js";
import {
  spinnerFns,
  loggerFns,
  FOUND,
  NOT_FOUND,
  ERROR,
  ERROR_MSG,
  EMPTY_ARRAY,
} from "../../../test/fixtures.js";
import { handler as breaches } from "../breaches.js";

const { logger, spinner } = stubOutput();

describe("command: breaches", () => {
  describe("normal output (default)", () => {
    it("calls spinner.start", async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await breaches({ domainFilter: FOUND, raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it("with data: calls spinner.stop and logger.log", async () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      expect(logger.log).toHaveBeenCalledTimes(0);
      await breaches({ domainFilter: FOUND, raw: false });
      expect(spinner.stop).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it("without data: only calls spinner.succeed", async () => {
      expect(spinner.succeed).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await breaches({ domainFilter: NOT_FOUND, raw: false });
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it("on error: only calls spinner.fail", async () => {
      server.use(
        http.get("*", () => {
          throw new Error(ERROR_MSG);
        }),
      );

      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await breaches({ domainFilter: ERROR, raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe("spam list filter", () => {
    it.each([
      [true, "true"],
      [false, "false"],
      [undefined, null],
    ])("spamList %s sends isSpamList %s", async (spamList, expected) => {
      let isSpamList: string | null = "unset";
      server.use(
        http.get("*/breaches", ({ request }) => {
          isSpamList = new URL(request.url).searchParams.get("isSpamList");

          return new Response(JSON.stringify(EMPTY_ARRAY));
        }),
      );

      await breaches({ spamList, raw: true });
      expect(isSpamList).toBe(expected);
    });
  });

  describe("raw mode", () => {
    it("does not call spinner.start", async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await breaches({ domainFilter: FOUND, raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it("with data: only calls logger.log", async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await breaches({ domainFilter: FOUND, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it("without data: does not call any spinner or logger methods", async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await breaches({ domainFilter: NOT_FOUND, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it("on error: only calls logger.error", async () => {
      server.use(
        http.get("*", () => {
          throw new Error(ERROR_MSG);
        }),
      );

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await breaches({ domainFilter: ERROR, raw: true });
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
        http.get("*", () => {
          throw new Error(ERROR_MSG);
        }),
      );

      expect(process.exitCode).toBeUndefined();
      await breaches({ domainFilter: ERROR, raw: false });
      expect(process.exitCode).toBe(1);
    });

    it("does not set exit code on success", async () => {
      expect(process.exitCode).toBeUndefined();
      await breaches({ domainFilter: FOUND, raw: false });
      expect(process.exitCode).toBeUndefined();
    });
  });
});
