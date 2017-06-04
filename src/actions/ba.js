import getBreachedAccount from '../api/getBreachedAccount';

export default (account, options) => {
  const acct = account.trim();
  if (acct.length) {
    getBreachedAccount(
      acct,
      options.domainFilter,
      options.truncate,
      options.raw,
    );
  } else {
    options.help();
  }
};
