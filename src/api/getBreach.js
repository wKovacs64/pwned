import hibp from 'hibp';
import prettyjson from 'prettyjson';
import spinner from '../utils/spinner';

/**
 * Fetches and outputs breach data for a single site by breach name.
 *
 * @param {string} name the name of a breach in the system
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {Promise} the resulting Promise where output is rendered
 */
export default (name, raw) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  return Promise.resolve(hibp.breach(name))
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
