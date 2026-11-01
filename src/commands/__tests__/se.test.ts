import { beforeEach, describe, expect, it, vi } from "vitest";
import { http } from "msw/http";
import { server } from "../../../test/server.js";
import {
  spinnerFns,
  loggerFns,
  FOUND,
  ERROR,
  ERROR_MSG,
} from "../../../test/fixtures.js";
import { logger as mockLogger } from "../../utils/logger.js";
import { spinner as mockSpinner } from "../../utils/spinner.js";
import { handler as se } from "../se.js";

vi.mock("../../utils/logger");
vi.mock("../../utils/spinner");

const logger = vi.mocked(mockLogger);
const spinner = vi.mocked(mockSpinner);

describe("command: se", () => {
  describe("normal output (default)", () => {
    it("calls spinner.start", async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await se({ domain: FOUND, alias: "security", raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it("on success: only calls spinner.succeed", async () => {
      expect(spinner.succeed).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await se({ domain: FOUND, alias: "security", raw: false });
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it("on error: only calls spinner.fail", async () => {
      server.use(
        http.post("*", () => {
          throw new Error(ERROR_MSG);
        }),
      );

      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await se({ domain: ERROR, alias: "security", raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe("request", () => {
    it("sends the domain and alias", async () => {
      let requestBody: unknown;
      server.use(
        http.post("*/domainVerification/sendEmail", async ({ request }) => {
          requestBody = await request.json();
          return new Response(null, { status: 200 });
        }),
      );

      await se({ domain: ` ${FOUND} `, alias: "security", raw: true });
      expect(requestBody).toEqual({
        DomainName: FOUND,
        EmailAlias: "security",
      });
    });
  });

  describe("raw mode", () => {
    it("does not call spinner.start", async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await se({ domain: FOUND, alias: "security", raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it("on success: only calls logger.log", async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await se({ domain: FOUND, alias: "security", raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it("on error: only calls logger.error", async () => {
      server.use(
        http.post("*", () => {
          throw new Error(ERROR_MSG);
        }),
      );

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await se({ domain: ERROR, alias: "security", raw: true });
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
      await se({ domain: ERROR, alias: "security", raw: false });
      expect(process.exitCode).toBe(1);
    });

    it("does not set exit code on success", async () => {
      expect(process.exitCode).toBeUndefined();
      await se({ domain: FOUND, alias: "security", raw: false });
      expect(process.exitCode).toBeUndefined();
    });
  });
});
