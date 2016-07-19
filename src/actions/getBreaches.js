import hibp from 'hibp';
import prettyjson from 'prettyjson';
import spinner from '../utils/spinner';

/**
 * Fetches and outputs all breached sites in the system.
 *
 * @param {string} [domain] a domain by which to filter the results
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {undefined}
 */
export default (domain, raw) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  hibp.breaches(domain)
      .then((breachData) => {
        if (!raw && process.stdout.isTTY) {
          spinner.stop();
          console.log();
        }
        if (raw) {
          console.log(JSON.stringify(breachData));
        } else if (breachData.length) {
          console.log(prettyjson.render(breachData));
        } else {
          console.log('No breaches found.');
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
