import { describe, it, expect } from "vitest";
import { spinnerFns } from "../../../test/fixtures.js";
import { spinner } from "../spinner.js";

describe("util: spinner", () => {
  it("returns an object with all the expected methods", () => {
    expect(spinner).toEqual(
      expect.objectContaining(
        Object.fromEntries(spinnerFns.map((fn) => [fn, expect.any(Function)])),
      ),
    );
  });
});
