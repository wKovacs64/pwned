
<a href="https://wkovacs64.github.io/pwned">
  <img
    alt="logo"
    title="logo"
    src="https://wkovacs64.github.io/pwned/logo.png"
    align="right"
    width="85"
  />
</a>

# 💥 pwned

_A command-line tool for querying [Troy Hunt][troy]'s [Have I been pwned?][haveibeenpwned] service using the [hibp][hibp] Node.js module._

[![npm Version][npm-image]][npm-url] [![Build Status][ci-image]][ci-url]
[![Code Coverage][coverage-image]][coverage-url]

## 📚 Table of Contents

- [💻 Installation](#-installation)
- [🔐 Protected Commands](#-protected-commands)
- [🛠️ Usage](#-usage)
- [🌟 Examples](#-examples)
- [📜 License](#-license)

## 💻 Installation 

Download and install [Node.js][nodejs], then install `pwned` globally using `npm`:

```shell
npm install pwned -g
```

Alternatively, you can run it on-demand using the [`npx`][npx] package runner:

```shell
npx pwned
```

## 🔐 Protected Commands

On July 18th, 2019, the haveibeenpwned.com API moved several services behind authentication, requiring an API key. See [Troy's blog post][api-key-blog-post] for rationale and a full explanation. To use some of `pwned` commands (e.g. `ba`, `pa`, and `search`), you will need to [get an API key][get-api-key] and run `pwned apiKey` to configure `pwned`. Other commands do not require an API key and can be used freely.

## 🛠️ Usage 

```
pwned <command>

Commands:
  pwned apiKey [key]            Set the API key for authenticated requests
  pwned ba <account|email>      Get all breaches for an account (username or email address)
  pwned breach <name>           Get a single breached site by breach name
  pwned breaches                Get all breaches in the system
  pwned dc                      Get all data classes in the system
  pwned pa <email>              Get all pastes for an account (email address)
  pwned pw <password>           Securely check a password for public exposure
  pwned search <account|email>  Search breaches and pastes for an account (username or email address)
  pwned subStatus               Get the subscription status of your API key

Options:
  -h, --help     Show help                                                                 [boolean]
  -v, --version  Show version number                                                       [boolean]
```

### 🌟 Examples 

Get all breaches for an account:

```
$ pwned ba pleasebeclean@fingerscrossed.tld
✔ Good news — no pwnage found! 🎉
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
✔ No breach found by that name. 🚫
```

Get all the data classes in the system:

```
$ pwned dc --raw
["Account balances", "Email addresses", "Passwords", ...]

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





[Securely][search-by-range] check a password to see if it has been exposed in a data breach:

```
$ pwned pw Password1234
⚠ Oh no — pwned 3360 times! 😱
```

Search both breaches and pastes for an account:

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

## 📜 License 

This tool is distributed under the [MIT License](LICENSE.txt).


