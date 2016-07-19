import hibp from 'hibp';
import prettyjson from 'prettyjson';
import spinner from '../utils/spinner';

/**
 * Fetches and outputs all data classes in the system.
 *
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {undefined}
 */
export default (raw) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  Promise.resolve(hibp.dataClasses())
      .then((dataClasses) => {
        if (!raw && process.stdout.isTTY) {
          spinner.stop();
          console.log();
        }
        if (raw) {
          console.log(JSON.stringify(dataClasses));
        } else {
          console.log(prettyjson.render(dataClasses));
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
