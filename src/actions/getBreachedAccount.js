import hibp from 'hibp';
import prettyjson from 'prettyjson';
import spinner from '../utils/spinner';

/**
 * Fetches and outputs breach data for the specified account.
 *
 * @param {string} account a username or email address
 * @param {string} [domain] a domain by which to filter the results
 * @param {boolean} [truncateResults] truncate the results to only include the
 * name of each breach (default: false)
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {undefined}
 */
export default (account, domain, truncateResults, raw) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  Promise.resolve(hibp.breachedAccount(account, domain, truncateResults))
      .then((breachData) => {
        if (!raw && process.stdout.isTTY) {
          spinner.stop();
          console.log();
        }
        if (breachData && raw) {
          console.log(JSON.stringify(breachData));
        } else if (breachData) {
          console.log(prettyjson.render(breachData));
        } else if (!breachData && !raw) {
          console.log('Good news — no pwnage found!');
        }
      })
      .catch((err) => {
        if (!raw && process.stdout.isTTY) {
          spinner.stop();
          console.log();
        }
        console.error(err.message);
      });
};
