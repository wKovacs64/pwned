import getBreachedAccount from '../actions/getBreachedAccount';

/**
 * Initializes the 'ba' command.
 *
 * @param {Object} program the Commander instance
 * @returns {undefined}
 */
export default (program) => {
  program
      .command('ba <account>')
      .description('get all breaches for an account (username or email ' +
          'address)')
      .option('-d, --domain-filter <domain>', 'filter breach data by domain')
      .option('-r, --raw', 'output the raw JSON data (or nothing, if no ' +
          'results found)')
      .option('-t, --truncate', 'truncate data to just the name of each breach')
      .action((account, options) => {
        account = account.trim();
        if (account.length) {
          getBreachedAccount(account,
              options.domainFilter,
              options.truncate,
              options.raw);
        } else {
          program.help();
        }
      });
};
