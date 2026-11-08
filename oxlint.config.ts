import { createConfig } from "@wkovacs64/oxlint-config";

export default createConfig({
  overrides: [
    {
      // bin/pwned.js imports the compiled lib/ output, which doesn't exist
      // until build, and the untyped source-map-support package, so every
      // value it touches is an error type to type-aware linting.
      files: ["bin/**"],
      rules: {
        "typescript/no-unsafe-argument": "off",
        "typescript/no-unsafe-call": "off",
        "typescript/no-unsafe-member-access": "off",
      },
    },
  ],
});
