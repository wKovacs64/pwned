---
title: pwned
---

<a href="https://wkovacs64.github.io/pwned">
  <img
    alt="logo"
    title="logo"
    src="https://wkovacs64.github.io/pwned/logo.png"
    align="right"
    width="85"
  />
</a>

## Installation

Download and install [Node.js](https://nodejs.org/en/download/), then install `pwned` globally using
`npm`:

```shell
npm install pwned -g
```

Alternatively, you can run it on-demand using the
[`npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) package
runner:

```shell
npx pwned
```

## Protected Commands

On July 18th, 2019, the haveibeenpwned.com API moved several services behind authentication,
requiring an API key. See
[Troy's blog post](https://www.troyhunt.com/authentication-and-the-have-i-been-pwned-api/) for
rationale and a full explanation. In order to use some of `pwned` commands (e.g. `ba`, `pa`, and
`search`), you will need to [get an API key](https://haveibeenpwned.com/API/Key) and run
`pwned apiKey <your-key>` to configure `pwned`. The other commands do not require an API key and you
may use them without obtaining one.

## Usage

```
pwned <command>

Commands:
  pwned apiKey <key>            set the API key to be used for authenticated requests
  pwned ba <account|email>      get all breaches for an account (username or email address)
  pwned breach <name>           get a single breached site by breach name
  pwned breaches                get all breaches in the system
  pwned dc                      get all data classes in the system
  pwned lb                      get the most recently added breach
  pwned pa <email>              get all pastes for an account (email address)
  pwned pw <password>           securely check a password for public exposure
  pwned search <account|email>  search breaches and pastes for an account (username or email
                                address)
  pwned subStatus               get the subscription status of your API key

Options:
  -h, --help     Show help                                                                 [boolean]
  -v, --version  Show version number                                                       [boolean]
```

#### Examples

Get all breaches for an account:

```
$ pwned ba pleasebeclean@fingerscrossed.tld
✔ Good news — no pwnage found!
```

Get all breaches in the system, filtering results to just the 'adobe.com' domain:

```
$ pwned breaches -d adobe.com
-
  Title:        Adobe
  Name:         Adobe
  Domain:       adobe.com
  BreachDate:   2013-10-04
  AddedDate:    2013-12-04T00:00:00Z
  ModifiedDate: 2013-12-04T00:00:00Z
  PwnCount:     152445165
  Description:  In October 2013, 153 million Adobe accounts were breached with each containing an internal ID, username, email, <em>encrypted</em> password and a password hint in plain text. The password cryptography was poorly done and <a href="http://stricture-group.com/files/adobe-top100.txt" target="_blank" rel="noopener">many were quickly resolved back to plain text</a>. The unencrypted hints also <a href="http://www.troyhunt.com/2013/11/adobe-credentials-and-serious.html" target="_blank" rel="noopener">disclosed much about the passwords</a> adding further to the risk that hundreds of millions of Adobe customers already faced.
  DataClasses:
    - Email addresses
    - Password hints
    - Passwords
    - Usernames
  IsVerified:   true
  IsFabricated: false
  IsSensitive:  false
  IsActive:     true
  IsRetired:    false
  IsSpamList:   false
  LogoType:     svg
```

Get a single breached site by breach name:

```
$ pwned breach MyCompany
✔ No breach found by that name.
```

Get all the data classes in the system, returning raw JSON results for external/chained consumption:

```
$ pwned dc --raw
["Account balances","Address book contacts","Age groups","Ages","Apps installed on devices","Astrological signs","Auth tokens","Avatars","Bank account numbers","Banking PINs","Beauty ratings","Biometric data","Browser user agent details","Buying preferences","Car ownership statuses","Career levels","Cellular network names","Charitable donations","Chat logs","Credit card CVV","Credit cards","Credit status information","Customer feedback","Customer interactions","Dates of birth","Deceased date","Deceased statuses","Device information","Device usage tracking data","Drinking habits","Drug habits","Eating habits","Education levels","Email addresses","Email messages","Employers","Ethnicities","Family members' names","Family plans","Family structure","Financial investments","Financial transactions","Fitness levels","Genders","Geographic locations","Government issued IDs","Health insurance information","Historical passwords","Home ownership statuses","Homepage URLs","IMEI numbers","IMSI numbers","Income levels","Instant messenger identities","IP addresses","Job titles","MAC addresses","Marital statuses","Names","Nationalities","Net worths","Nicknames","Occupations","Parenting plans","Partial credit card data","Passport numbers","Password hints","Passwords","Payment histories","Payment methods","Personal descriptions","Personal health data","Personal interests","Phone numbers","Physical addresses","Physical attributes","Political donations","Political views","Private messages","Professional skills","Profile photos","Purchases","Purchasing habits","Races","Recovery email addresses","Relationship statuses","Religions","Reward program balances","Salutations","School grades (class levels)","Security questions and answers","Sexual fetishes","Sexual orientations","Smoking habits","SMS messages","Social connections","Social media profiles","Spoken languages","Support tickets","Survey results","Time zones","Travel habits","User statuses","User website URLs","Usernames","Utility bills","Vehicle details","Website activity","Work habits","Years of birth","Years of professional experience"]
```

Get all pastes for an email address:

```
$ pwned pa nobody@nowhere.com
-
  Source:     Pastebin
  Id:         YrpQA60S
  Title:      null
  Date:       2018-01-24T07:54:15Z
  EmailCount: 16476
-
  Source:     Pastebin
  Id:         suPshHZ1
  Title:      null
  Date:       2017-09-06T03:41:33Z
  EmailCount: 20444
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
-
  Source:     AdHocUrl
  Id:         http://balockae.online/files/BlackMarketReloaded_users.sql
  Title:      balockae.online
  Date:       null
  EmailCount: 10547
```

[Securely](https://haveibeenpwned.com/API/v2#SearchingPwnedPasswordsByRange) check a password to see
if it has been exposed in a data breach:

```
$ pwned pw Password1234
⚠ Oh no — pwned 3360 times!
```

Search both breaches and pastes for an account (truncating breach data):

```
$ pwned search nobody
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

This tool is distributed under the
[MIT License](https://github.com/wKovacs64/pwned/tree/main/LICENSE.txt).
