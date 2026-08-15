import { describe, expect, it, vi } from "vitest";
import { loggerFns } from "../../../test/fixtures.js";
import { logger, type LoggerFunction } from "../logger.js";

describe("util: logger", () => {
  it("returns an object with all the expected methods", () => {
    expect(logger).toEqual(
      expect.objectContaining(
        loggerFns.reduce(
          (obj, fn) => ({
            ...obj,
            [fn]: expect.any(Function) as unknown,
          }),
          {},
        ),
      ),
    );
  });

  it("calls the corresponding console functions with the same arguments", () => {
    const args = ["Wubba lubba dub dub!", { param: "value" }];
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
