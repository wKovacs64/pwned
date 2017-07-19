# pwned

*A command-line tool for querying [Troy Hunt][troy]'s
[Have I been pwned?][haveibeenpwned] service using the [hibp][hibp] Node.js
module.*

[![npm Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Code Coverage][coveralls-image]][coveralls-url]

## Installation

Download and install [Node.js][nodejs], then install `pwned` globally using
`npm`:

```shell
npm install pwned -g
```

## Usage

```
Usage: pwned [option | command]


Commands:

  ba [options] <account>      get all breaches for an account (username or email address)
  breaches [options]          get all breaches in the system
  breach [options] <name>     get a single breached site by breach name
  dc [options]                get all data classes in the system
  pa [options] <email>        get all pastes for an account (email address)
  search [options] <account>  search breaches and pastes for an account (username or email address)

Each command has its own -h (--help) option.

Options:

  -h, --help     output usage information
  -v, --version  output the version number
```

#### Examples

Get all breaches for an account:
```
$ pwned ba pleasebeclean@fingerscrossed.tld
Good news — no pwnage found!
```

Get all breaches in the system, filtering results to just the 'adobe.com' domain:
```
$ pwned breaches -d adobe.com
-
  Title:       Adobe
  Name:        Adobe
  Domain:      adobe.com
  BreachDate:  2013-10-04
  AddedDate:   2013-12-04T00:00:00Z
  PwnCount:    152445165
  Description: In October 2013, 153 million Adobe accounts were breached with each containing an internal ID, username, email, <em>encrypted</em> password and a password hint in plain text. The password cryptography was poorly done and <a href="http://stricture-group.com/files/adobe-top100.txt" target="_blank">many were quickly resolved back to plain text</a>. The unencrypted hints also <a href="http://www.troyhunt.com/2013/11/adobe-credentials-and-serious.html" target="_blank">disclosed much about the passwords</a> adding further to the risk that hundreds of millions of Adobe customers already faced.
  DataClasses:
    - Email addresses
    - Password hints
    - Passwords
    - Usernames
  IsVerified:  true
  IsSensitive: false
  IsActive:    true
  IsRetired:   false
  LogoType:    svg
```

Get a single breached site by breach name:
```
$ pwned breach MyCompany
No breach found by that name.
```

Get all the data classes in the system, returning raw JSON results for external/chained consumption:
```
$ pwned dc --raw
["Account balances","Age groups","Astrological signs","Avatars","Bank account numbers","Banking PINs","Beauty ratings","Biometric data","Car ownership statuses","Career levels","Chat logs","Credit cards","Customer feedback","Customer interactions","Dates of birth","Device information","Device usage tracking data","Drinking habits","Drug habits","Education levels","Email addresses","Email messages","Employers","Ethnicities","Family members' names","Family plans","Financial transactions","Fitness levels","Genders","Geographic locations","Government issued IDs","Historical passwords","Home ownership statuses","Homepage URLs","Income levels","Instant messenger identities","IP addresses","Job titles","MAC addresses","Marital statuses","Names","Nicknames","Parenting plans","Partial credit card data","Passport numbers","Password hints","Passwords","Payment histories","Personal descriptions","Personal interests","Phone numbers","Physical addresses","Physical attributes","Political views","Private messages","Purchases","Races","Recovery email addresses","Relationship statuses","Religions","Reward program balances","Salutations","Security questions and answers","Sexual fetishes","Sexual orientations","Smoking habits","SMS messages","Social connections","Spoken languages","Time zones","Travel habits","User agent details","User statuses","User website URLs","Usernames","Website activity","Work habits","Years of birth"]
```

Get all pastes for an email address:
```
$ pwned pa nobody@nowhere.com
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
-
  Source:     AdHocUrl
  Id:         http://siph0n.in/exploits.php?id=4737
  Title:      PayPalSucks Database 102k
  Date:       null
  EmailCount: 82071
```

Search both breaches and pastes for an account (truncating breach data):
```
$ pwned search nobody -t
breaches:
  -
    Name: BattlefieldHeroes
  -
    Name: CannabisForum
  -
    Name: Forbes
  -
    Name: Gawker
  -
    Name: HackForums
  -
    Name: LoungeBoard
  -
    Name: PokemonCreed
  -
    Name: Win7Vista
pastes:   null
```

## License

This tool is distributed under the [MIT License](LICENSE.txt).

[npm-image]: https://img.shields.io/npm/v/pwned.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/pwned
[travis-image]: https://img.shields.io/travis/wKovacs64/pwned.svg?style=flat-square
[travis-url]: https://travis-ci.org/wKovacs64/pwned
[coveralls-image]: https://img.shields.io/coveralls/wKovacs64/pwned.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/wKovacs64/pwned
[troy]: http://www.troyhunt.com
[haveibeenpwned]: https://haveibeenpwned.com
[hibp]: https://github.com/wKovacs64/hibp
[nodejs]: https://nodejs.org/en/download/
