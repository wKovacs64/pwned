# pwned

*A command-line tool for querying [Troy Hunt](http://www.troyhunt.com/)'s
[Have I been pwned?](https://haveibeenpwned.com/) service using the
[hibp](https://github.com/wKovacs64/hibp) Node.js module.*

[![npm Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Installation

```shell
npm install pwned -g
```

## Usage

```
Usage:  pwned [option | command]


Commands:

  ba [options] <account>   get all breaches for an account (username or email address)
  breaches [options]       get all breaches in the system
  breach [options] <name>  get a single breached site by breach name
  dc [options]             get all data classes in the system
  pa [options] <email>     get all pastes for an account (email address)

Each command has its own -h (--help) option.

Options:

  -h, --help     output usage information
  -v, --version  output the version number
```

#### Examples

Get all breaches for an account:
```
$ pwned ba pleasebeclean@fingerscrossed.tld

Fetching data... |
Good news — no pwnage found!
```

Get all breaches in the system, filtering results to just the 'adobe.com' domain:
```
$ pwned breaches -d adobe.com

Fetching data... \
-
  Title:       Adobe
  Name:        Adobe
  Domain:      adobe.com
  BreachDate:  2013-10-04
  AddedDate:   2013-12-04T00:00:00Z
  PwnCount:    152445165
  Description: The big one. In October 2013, 153 million Adobe accounts were breached with each containing an internal ID, username, email, <em>encrypted</em> password and a password hint in plain text. The password cryptography was poorly done and <a href="http://stricture-group.com/files/adobe-top100.txt" target="_blank">many were quickly resolved back to plain text</a>. The unencrypted hints also <a href="http://www.troyhunt.com/2013/11/adobe-credentials-and-serious.html" target="_blank">disclosed much about the passwords</a> adding further to the risk that hundreds of millions of Adobe customers already faced.
  DataClasses:
    - Email addresses
    - Password hints
    - Passwords
    - Usernames
  IsVerified:  true
  IsSensitive: false
  IsRetired:   false
  LogoType:    svg
```

Get a single breached site by breach name:
```
$ pwned breach MyCompany

Fetching data... \
No breach found by that name.
```

Get all the data classes in the system, returning raw JSON results for external/chained consumption:
```
$ pwned dc --raw

["Account balances","Age groups","Avatars","Career levels","Credit cards","Customer interactions","Dates of birth","Device usage tracking data","Education levels","Email addresses","Email messages","Employers","Ethnicities","Genders","Geographic location","Government issued IDs","Historical passwords","Home addresses","Homepage URLs","Instant messenger identities","IP addresses","Job titles","MAC addresses","Names","Nicknames","Passport numbers","Password hints","Passwords","Payment histories","Phone numbers","Private messages","Purchases","Races","Recovery email addresses","Relationship statuses","Reward program balances","Salutations","Security questions and answers","Sexual preferences","SMS messages","Social connections","Spoken languages","Time zones","User agent details","User website URLs","Usernames","Website activity","Years of birth"]
```

Get all pastes for an email address:
```
$ pwned pa nobody@nowhere.com

Fetching data... \
-
  Source:     Pastebin
  Id:         xyb8vavK
  Title:      null
  Date:       2015-06-01T00:16:46Z
  EmailCount: 8
-
  Source:     Pastebin
  Id:         DaaFj8Be
  Title:      CrackingCore - Redder04
  Date:       2015-04-05T22:22:39Z
  EmailCount: 116
-
  Source:     Pastebin
  Id:         9MAAgecd
  Title:      IPTV Yabancı Combolist
  Date:       2015-02-07T15:21:00Z
  EmailCount: 244
-
  Source:     Pastebin
  Id:         QMx1dPUT
  Title:      null
  Date:       2015-02-02T20:45:00Z
  EmailCount: 6607
-
  Source:     Pastebin
  Id:         zUFSee4n
  Title:      nethingoez
  Date:       2015-01-21T15:13:00Z
  EmailCount: 312
-
  Source:     AdHocUrl
  Id:         http://siph0n.in/exploits.php?id=4560
  Title:      BuzzMachines.com 40k+
  Date:       null
  EmailCount: 36959
```

## License

This tool is distributed under the [MIT License](LICENSE.txt).

[npm-image]: https://img.shields.io/npm/v/pwned.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/pwned
[travis-image]: https://img.shields.io/travis/wKovacs64/pwned.svg?style=flat-square
[travis-url]: https://travis-ci.org/wKovacs64/pwned
