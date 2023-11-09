# Change Log

## 12.0.0

### Major Changes

- [#243](https://github.com/wKovacs64/pwned/pull/243) [`fd72c24`](https://github.com/wKovacs64/pwned/commit/fd72c24a77892fb9b746aa717210ee4f6445d643) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Drop support for Node.js 16 as it is [end-of-life](https://nodejs.org/en/download/releases), making the new minimum Node.js runtime v18.0.0. Please upgrade your Node.js environment if necessary, or continue using a previous release if you are unable to upgrade your environment.

### Minor Changes

- [#248](https://github.com/wKovacs64/pwned/pull/248) [`f75f0aa`](https://github.com/wKovacs64/pwned/commit/f75f0aacff7d72af3d49411fa1a413e476e17f65) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Add new `subStatus` command to get the current subscription status of your HIBP API key. See https://haveibeenpwned.com/API/v3#SubscriptionStatus for more information.

- [#247](https://github.com/wKovacs64/pwned/pull/247) [`37f3a6f`](https://github.com/wKovacs64/pwned/commit/37f3a6fecb9497ae1c5315a56a55bd5c1c409d9d) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Add the `--pad` (`-p`) option to the `pw` command, allowing you to ask the remote API to add padding to the response to obscure the password prefix. See https://www.troyhunt.com/enhancing-pwned-passwords-privacy-with-padding/ for more information.

- [#246](https://github.com/wKovacs64/pwned/pull/246) [`372b291`](https://github.com/wKovacs64/pwned/commit/372b2916fc2926c64cf3b1e1049449da02a2eac9) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Refresh the project logo.

## 11.0.0

### Major Changes

- [`3fe2524`](https://github.com/wKovacs64/pwned/commit/3fe25245bd702886d2788541006cf236d915c800) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Drop support for Node.js 14 as it is [end-of-life](https://nodejs.org/en/about/releases/), making the new minimum Node.js runtime v16.0.0. Please upgrade your Node.js environment if necessary, or continue using a previous release if you are unable to upgrade your environment.

## 10.0.1

### Patch Changes

- [`ae51440`](https://github.com/wKovacs64/pwned/commit/ae51440c39454b3f6921346b85c6500e9361b040) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Write version bumps to `package-lock.json`.

## 10.0.0

### Major Changes

- [`581d0dc4`](https://github.com/wKovacs64/pwned/commit/581d0dc4dc7d3e796866003c116d5ca44da838b4) and [`1bd53262`](https://github.com/wKovacs64/pwned/commit/1bd532629446b5f9b72aac6ff82c5bafc9caa2fb) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Drop support for Node.js 10 and 12 as they are both [end-of-life](https://nodejs.org/en/about/releases/), making the new minimum Node.js runtime v14.13.1. This also converts the project to pure ESM as it is fully supported in 14.13.1, 16 and beyond. Please upgrade your Node.js environment if necessary, or continue using the latest v9 release of `pwned` if you are unable to upgrade your environment.
