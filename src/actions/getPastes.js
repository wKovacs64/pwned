import hibp from 'hibp';
import prettyjson from 'prettyjson';
import spinner from '../utils/spinner';

/**
 * Fetches and outputs all pastes for an account (email address).
 *
 * @param {string} email the email address to query
 * @param {boolean} [raw] output the raw JSON data (default: false)
 * @returns {undefined}
 */
export default (email, raw) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  hibp.pasteAccount(email)
      .then((pasteData) => {
        if (!raw && process.stdout.isTTY) {
          spinner.stop();
          console.log();
        }
        if (raw) {
          console.log(JSON.stringify(pasteData));
        } else if (pasteData) {
          console.log(prettyjson.render(pasteData));
        } else {
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
