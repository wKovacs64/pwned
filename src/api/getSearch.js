import { search } from 'hibp';
import prettyjson from 'prettyjson';
import logger from '../utils/logger';
import spinner from '../utils/spinner';

export default (account, domain, truncate, raw) => {
  if (!raw && process.stdout.isTTY) {
    spinner.start();
  }
  return Promise.resolve(search(account, { domain, truncate }))
    .then((searchData) => {
      const foundData = !!(searchData.breaches || searchData.pastes);
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      if (foundData && raw) {
        logger.log(JSON.stringify(searchData));
      } else if (foundData) {
        logger.log(prettyjson.render(searchData));
      } else if (!foundData && !raw) {
        logger.log('Good news — no pwnage found!');
      }
    })
    .catch((err) => {
      if (!raw && process.stdout.isTTY) {
        spinner.stop(true);
      }
      logger.error(err.message);
    });
};
