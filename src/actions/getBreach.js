import hibp from 'hibp';
import prettyjson from 'prettyjson';
import spinner from '../utils/spinner';

/**
 * Fetches and outputs breach data for a single site by breach name.
 *
 * @param {string} name the name of a breach in the system
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {undefined}
 */
export default (name, raw) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  hibp.breach(name)
      .then((breachData) => {
        if (!raw && process.stdout.isTTY) {
          spinner.stop();
          console.log();
        }
        if (raw) {
          console.log(JSON.stringify(breachData));
        } else if (breachData) {
          console.log(prettyjson.render(breachData));
        } else {
          console.log('No breach found by that name.');
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
