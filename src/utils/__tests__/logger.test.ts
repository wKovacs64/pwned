import { describe, expect, it, vi } from "vitest";
import { loggerFns } from "../../../test/fixtures.js";
import { logger, type LoggerFunction } from "../logger.js";

describe("util: logger", () => {
  it("returns an object with all the expected methods", () => {
    expect(logger).toEqual(
      expect.objectContaining(
        Object.fromEntries(loggerFns.map((fn) => [fn, expect.any(Function)])),
      ),
    );
  });

  it("calls the corresponding console functions with the same arguments", () => {
    const args = ["Wubba lubba dub dub!"] as const;
    loggerFns.forEach((fn) => {
      const mock = vi
        .spyOn(console, fn)
        .mockImplementation(vi.fn<LoggerFunction>());

      expect(mock).toHaveBeenCalledTimes(0);
      logger[fn](...args);
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(...args);
      mock.mockRestore();
    });
  });
});
