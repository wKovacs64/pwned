import getSearch from '../api/getSearch';

export default (account, options) => {
  const acct = account.trim();
  if (acct.length) {
    getSearch(
      acct,
      options.domainFilter,
      options.truncate,
      options.raw,
    );
  } else {
    options.help();
  }
};
