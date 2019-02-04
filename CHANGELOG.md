# Change Log

## Version 6.3.0 _(2019-02-04)_

- Specified a custom `User-Agent` to explicitly identify ourselves to the
  `haveibeenpwned.com` API ([9185536d][9185536d])

## Version 6.2.0 _(2019-01-19)_

- Added `-i`/`--include-unverified` option to `ba` command to include
  "unverified" breaches in the results
- Converted to TypeScript ([#26][26])

## Version 6.1.2 _(2018-12-20)_

- Moved coverage reports from Coveralls to Codecov ([#24][24])
- Moved CI from Travis to Circle ([#25][25])

## Version 6.1.1 _(2018-06-26)_

- Updated dependencies (includes fix for `Forbidden` errors from `hibp@7.1.3`)

## Version 6.1.0 _(2018-05-23)_

- Made the progress spinner animation a little more fun and added status emojis
  (✔, ⚠, ✖) to some output ([#11][11])

## Version 6.0.0 _(2018-03-13)_

- Upgraded `hibp` to v7 which handles password hashing and suffix processing,
  removing this logic from `pwned`.
- The `pw` command now includes a count in the output, indicating how many times
  the given password was exposed in a breach.

##### Breaking Changes:

- Dropped support for Node < 6

## Version 5.0.0 _(2018-02-25)_

- Refactored `pw` command to be secure by default (#8). Passwords will no longer
  be sent over the network. Instead, the first 5 characters of the SHA-1 hash of
  the password will be sent, and the list of suffixes that match the submitted
  prefix will be returned. `pwned` will then search the range of suffixes for
  the suffix from your hash. If a match is found, the password has been
  compromised in a breach.

##### Breaking Changes:

- The `pw` command no longer takes the `-s` (`--sha1`) option. Instead, all
  passwords will be taken literally and hashed. This is due to a remote API
  endpoint change which no longer performs automatic hash detection.

## Version 4.0.3 _(2017-12-07)_

- Updated `hibp` to avoid Chromium download when running with `npx`

## Version 4.0.2 _(2017-12-07)_

- Fixed `regeneratorRuntime is not defined` error :scream:
- Reformated some documentation files
- Updated dependencies

## Version 4.0.1 _(2017-11-08)_

- Internal maintenance

## Version 4.0.0 _(2017-10-24)_

- Migrated from commander to yargs (#6) :skull:
- Added command suggestions if no matching command is found

## Version 3.2.1 _(2017-10-17)_

- Fixed displaying help on unknown command (#4)
- Replaced testing toolchain with jest (#5)
- Removed Babel plugins
- Updated dependencies

## Version 3.2.0 _(2017-08-05)_

- Added new `pw` command to check if a password has been exposed in a data
  breach (#3)
- Enabled `source-map-support` in the entry point for easier debugging

## Version 3.1.2 _(2017-07-10)_

- Removed deprecated `preferGlobal` field from package.json
- Updated dependencies

## Version 3.1.1 _(2017-06-08)_

- Updated README to include `search` command

## Version 3.1.0 _(2017-06-08)_

- Added new `search` command to query breaches and pastes simultaneously (like
  the search form on the [website][haveibeenpwned])
- Optimized stub restores/resets in tests
- Updated dependencies

## Version 3.0.1 _(2017-01-04)_

- First release of 2017! :tada:
- Removed leftover `es6-promise` dependency
- Updated dependencies

## Version 3.0.0 _(2016-11-08)_

- Dropped support for Node < 4
- Updated dependencies

## Version 2.0.2 _(2016-10-03)_

- Switched code style from SemiStandard to Airbnb
- Improved/optimized tests
- Updated dependencies

## Version 2.0.1 _(2016-08-07)_

- Updated examples in README to reflect 2.0.0 changes

## Version 2.0.0 _(2016-08-07)_

- Removed spinner output when command completes

  _This is technically a breaking change as the output for the same input will
  be different than in previous versions. Previously, the progress spinner was
  included in the output (unless using the `--raw` option) and now it isn't. So,
  if you were previously parsing the **formatted** (non-raw) output, you may
  need to adjust._

- Shortened error messages

  _In the event of a failed request to the remote API (network errors, etc.), an
  error message is written to `stderr`. Due to an upstream change in the
  underlying network request technology in the `hibp` library, these messages
  will be significantly shorter as only the "reason" will be displayed now as
  opposed to a more verbose explanation of what went wrong._

- Added tests
- Updated dependencies

## Version 1.0.8 _(2016-07-21)_

- Normalized command behavior (suppress output for empty results in raw mode)
- Fixed usage output for unknown or missing commands
- Restructured project
- Updated dependencies

## Version 1.0.7 _(2016-06-28)_

- Increased visibility in npm search
- Minor improvements to development environment

## Version 1.0.6 _(2016-04-29)_

- Fixed grammar typo in usage information

## Version 1.0.5 _(2016-04-22)_

- Updated dependencies

## Version 1.0.4 _(2016-04-12)_

- Updated hibp to 1.0.4

## Version 1.0.3 _(2016-04-12)_

- Skipped (to bring version in line with hibp dependency)

## Version 1.0.2 _(2016-04-10)_

- Updated hibp to 1.0.3

## Version 1.0.1 _(2016-04-10)_

- Updated hibp to 1.0.2
- Removed temporary hack for broken '[breach][singlebreach]' endpoint (moved to
  hibp)

## Version 1.0.0 _(2016-04-09)_

- Initial release

[haveibeenpwned]: https://haveibeenpwned.com
[singlebreach]: https://haveibeenpwned.com/API/v2#SingleBreach
[11]: https://github.com/wKovacs64/pwned/pull/11
[24]: https://github.com/wKovacs64/pwned/pull/24
[25]: https://github.com/wKovacs64/pwned/pull/25
[26]: https://github.com/wKovacs64/pwned/pull/26
[9185536d]:
  https://github.com/wKovacs64/pwned/commit/9185536d1d33c34c6d45a55d0a78f837612371cb
