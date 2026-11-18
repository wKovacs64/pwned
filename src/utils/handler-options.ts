import type { ArgumentsCamelCase, Argv } from "yargs";

/**
 * The options a command's handler reads, inferred from its builder: each
 * positional and option by its camelCase name, without the kebab-case
 * originals, yargs's `_` and `$0`, or its catch-all index signature.
 *
 * Only literal option keys are typed, so each option is keyed by its long name
 * with its short flag as the alias.
 */
export type HandlerOptions<Builder extends (yargs: Argv) => Argv<object>> =
  ReturnType<Builder> extends Argv<infer Args>
    ? {
        [
          Key in keyof ArgumentsCamelCase<Args> as string extends Key
            ? never
            : Key extends `${string}-${string}` | "_" | "$0"
              ? never
              : Key
        ]: ArgumentsCamelCase<Args>[Key];
      }
    : never;
