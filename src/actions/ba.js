import getBreachedAccount from '../api/getBreachedAccount';

export default (account, options) => {
  account = account.trim();
  if (account.length) {
    getBreachedAccount(account,
        options.domainFilter,
        options.truncate,
        options.raw);
  } else {
    options.help();
  }
};
