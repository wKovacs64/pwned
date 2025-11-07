# Change Log

## 13.1.0

### Minor Changes

- [#327](https://github.com/wKovacs64/pwned/pull/327) [`ee8380b`](https://github.com/wKovacs64/pwned/commit/ee8380b28588c184616aebf257c1b9ddc45ef9fb) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Add new `bd` command to get all breached email addresses for a domain. See https://haveibeenpwned.com/API/v3#BreachesForDomain for more information.

- [#327](https://github.com/wKovacs64/pwned/pull/327) [`ee8380b`](https://github.com/wKovacs64/pwned/commit/ee8380b28588c184616aebf257c1b9ddc45ef9fb) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Add new `lb` command to get the most recently added breach. See https://haveibeenpwned.com/API/v3#MostRecentBreach for more information.

- [#327](https://github.com/wKovacs64/pwned/pull/327) [`ee8380b`](https://github.com/wKovacs64/pwned/commit/ee8380b28588c184616aebf257c1b9ddc45ef9fb) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Add new `sd` command to get all subscribed domains for your account. See https://haveibeenpwned.com/API/v3#SubscribedDomains for more information.

- [#327](https://github.com/wKovacs64/pwned/pull/327) [`ee8380b`](https://github.com/wKovacs64/pwned/commit/ee8380b28588c184616aebf257c1b9ddc45ef9fb) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Add new `slbe` command to get all stealer log domains for an email address. See https://haveibeenpwned.com/API/v3#StealerLogsForEmail for more information.

- [#327](https://github.com/wKovacs64/pwned/pull/327) [`ee8380b`](https://github.com/wKovacs64/pwned/commit/ee8380b28588c184616aebf257c1b9ddc45ef9fb) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Add new `slbed` command to get all stealer log email aliases for an email domain. See https://haveibeenpwned.com/API/v3#StealerLogsForEmailDomain for more information.

- [#327](https://github.com/wKovacs64/pwned/pull/327) [`ee8380b`](https://github.com/wKovacs64/pwned/commit/ee8380b28588c184616aebf257c1b9ddc45ef9fb) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Add new `slbwd` command to get all stealer log email addresses for a website domain. See https://haveibeenpwned.com/API/v3#StealerLogsForWebsiteDomain for more information.

### Patch Changes

- [#329](https://github.com/wKovacs64/pwned/pull/329) [`1ba5785`](https://github.com/wKovacs64/pwned/commit/1ba5785fdcf9d8f9e0aec42ec93b89cc1c24cf0f) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Update `conf` to v15.0.2.

- [#327](https://github.com/wKovacs64/pwned/pull/327) [`ee8380b`](https://github.com/wKovacs64/pwned/commit/ee8380b28588c184616aebf257c1b9ddc45ef9fb) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Update `hibp` to v15.1.0.

## 13.0.0

### Major Changes

- [#299](https://github.com/wKovacs64/pwned/pull/299) [`3427321`](https://github.com/wKovacs64/pwned/commit/3427321e3b596f82467949512b48759bc42af980) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Drop support for Node.js 18 as it is [end-of-life](https://nodejs.org/en/download/releases), making the new minimum Node.js runtime v20.19.0. Please upgrade your Node.js environment if necessary, or continue using a previous release if you are unable to upgrade your environment.
  - Update various dependencies

    ```
    conf                       ^13.0.1  →   ^13.1.0
    hibp                       ^14.1.2  →   ^15.0.1
    ora                         ^8.0.1  →    ^8.2.0
    ```

## 12.1.2

### Patch Changes

- [#293](https://github.com/wKovacs64/pwned/pull/293) [`901eefc`](https://github.com/wKovacs64/pwned/commit/901eefc838d19631932b105aaa716712e67bb2a6) Thanks [@dependabot](https://github.com/apps/dependabot)! - Update `undici` to v6.21.1 (only matters on Node v18).

## 12.1.1

### Patch Changes

- [#277](https://github.com/wKovacs64/pwned/pull/277) [`fc0efb9`](https://github.com/wKovacs64/pwned/commit/fc0efb935e793e2c66251cda3fb894a7bf4b2a49) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Recommend the interactive prompt of the `apiKey` command over providing your key as a command-line argument (for enhanced security) when the API responds with 401 Unauthorized.

- [#274](https://github.com/wKovacs64/pwned/pull/274) [`50f59ec`](https://github.com/wKovacs64/pwned/commit/50f59ece0e9f7c77d049ee4f94890c88155f1b04) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Update `conf` to v13.0.1, `ora` to v8.0.1, and `hibp` to v14.1.2. The last one fixes 401 Unauthorized response handling, as the [haveibeenpwned.com API (v3)](https://haveibeenpwned.com/API/v3#Authorisation) changed its response format.

## 12.1.0

### Minor Changes

- [#253](https://github.com/wKovacs64/pwned/pull/253) [`d80c130`](https://github.com/wKovacs64/pwned/commit/d80c130f4610ff5f349a40e09b920ea436fc76c8) Thanks [@wKovacs64](https://github.com/wKovacs64)! - Provide an interactive prompt for the API key when the `apiKey` command is issued without an argument. This is a safer way to input your API key, as providing it on the command line may cause it to show up in your shell's command history.

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
