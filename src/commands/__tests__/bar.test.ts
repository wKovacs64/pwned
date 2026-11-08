import { beforeEach, describe, expect, it } from "vitest";
import { http } from "msw/http";
import { server } from "../../../test/server.js";
import { stubOutput } from "../../../test/stub-output.js";
import {
  spinnerFns,
  loggerFns,
  FOUND,
  ERROR,
  EMPTY_ARRAY,
  ERROR_MSG,
} from "../../../test/fixtures.js";
import { handler as bar } from "../bar.js";

const { logger, spinner } = stubOutput();

describe("command: bar", () => {
  describe("normal output (default)", () => {
    it("calls spinner.start", async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await bar({ email: FOUND, raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it("with data: calls spinner.stop and logger.log", async () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      expect(logger.log).toHaveBeenCalledTimes(0);
      await bar({ email: FOUND, raw: false });
      expect(spinner.stop).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it("without data: only calls spinner.succeed", async () => {
      server.use(
        http.get("*/breachedaccount/range/:prefix", () => {
          return new Response(JSON.stringify(EMPTY_ARRAY));
        }),
      );

      expect(spinner.succeed).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await bar({ email: FOUND, raw: false });
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
      await bar({ email: ERROR, raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe("hash range", () => {
    it("only sends the first six characters of the normalized hash", async () => {
      let requestedPath = "";
      server.use(
        http.get("*/breachedaccount/range/:prefix", ({ request }) => {
          requestedPath = new URL(request.url).pathname;

          return new Response(JSON.stringify(EMPTY_ARRAY));
        }),
      );

      await bar({ email: ` ${FOUND.toUpperCase()} `, raw: true });
      expect(requestedPath).toMatch(/\/breachedaccount\/range\/62CDB7$/);
    });

    it("discards results for other accounts", async () => {
      await bar({ email: FOUND, raw: true });
      expect(logger.log).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledWith('[{"Name":"Adobe"}]');
    });
  });

  describe("raw mode", () => {
    it("does not call spinner.start", async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await bar({ email: FOUND, raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it("with data: only calls logger.log", async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await bar({ email: FOUND, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it("without data: does not call any spinner or logger methods", async () => {
      server.use(
        http.get("*/breachedaccount/range/:prefix", () => {
          return new Response(JSON.stringify(EMPTY_ARRAY));
        }),
      );

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await bar({ email: FOUND, raw: true });
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
      await bar({ email: ERROR, raw: true });
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
      await bar({ email: ERROR, raw: false });
      expect(process.exitCode).toBe(1);
    });

    it("does not set exit code on success", async () => {
      expect(process.exitCode).toBeUndefined();
      await bar({ email: FOUND, raw: false });
      expect(process.exitCode).toBeUndefined();
    });
  });
});
