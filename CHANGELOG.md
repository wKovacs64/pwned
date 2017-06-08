# Change Log

## Version 3.1.1 *(2017-06-08)*

* Updated README to include `search` command

## Version 3.1.0 *(2017-06-08)*

* Added new `search` command to query breaches and pastes simultaneously (like
  the search form on the [website][haveibeenpwned])
* Optimized stub restores/resets in tests
* Updated dependencies

## Version 3.0.1 *(2017-01-04)*

* First release of 2017! :tada:
* Removed leftover `es6-promise` dependency
* Updated dependencies

## Version 3.0.0 *(2016-11-08)*

* Dropped support for Node < 4
* Updated dependencies

## Version 2.0.2 *(2016-10-03)*

* Switched code style from SemiStandard to Airbnb
* Improved/optimized tests
* Updated dependencies

## Version 2.0.1 *(2016-08-07)*

* Updated examples in README to reflect 2.0.0 changes

## Version 2.0.0 *(2016-08-07)*

* Removed spinner output when command completes

  *This is technically a breaking change as the output for the same input will
  be different than in previous versions. Previously, the progress spinner was
  included in the output (unless using the `--raw` option) and now it isn't. So,
  if you were previously parsing the __formatted__ (non-raw) output, you may
  need to adjust.*
* Shortened error messages

  *In the event of a failed request to the remote API (network errors, etc.), an
  error message is written to `stderr`. Due to an upstream change in the
  underlying network request technology in the `hibp` library, these messages
  will be significantly shorter as only the "reason" will be displayed now as
  opposed to a more verbose explanation of what went wrong.*
* Added tests
* Updated dependencies

## Version 1.0.8 *(2016-07-21)*

* Normalized command behavior (suppress output for empty results in raw mode)
* Fixed usage output for unknown or missing commands
* Restructured project
* Updated dependencies

## Version 1.0.7 *(2016-06-28)*

* Increased visibility in npm search
* Minor improvements to development environment

## Version 1.0.6 *(2016-04-29)*

* Fixed grammar typo in usage information

## Version 1.0.5 *(2016-04-22)*

* Updated dependencies

## Version 1.0.4 *(2016-04-12)*

* Updated hibp to 1.0.4

## Version 1.0.3 *(2016-04-12)*

* Skipped (to bring version in line with hibp dependency)

## Version 1.0.2 *(2016-04-10)*

* Updated hibp to 1.0.3

## Version 1.0.1 *(2016-04-10)*

* Updated hibp to 1.0.2
* Removed temporary hack for broken '[breach][singlebreach]' endpoint (moved to
  hibp)

## Version 1.0.0 *(2016-04-09)*

* Initial release

[haveibeenpwned]: https://haveibeenpwned.com
[singlebreach]: https://haveibeenpwned.com/API/v2#SingleBreach
