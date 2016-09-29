import breaches from '../actions/breaches';

/**
 * Initializes the 'breaches' command.
 *
 * @param {Object} program the Commander instance
 * @returns {undefined}
 */
export default (program) => {
  program
    .command('breaches')
    .description('get all breaches in the system')
    .option('-d, --domain-filter <domain>', 'filter breach data by domain')
    .option('-r, --raw', 'output the raw JSON data (or nothing, if no ' +
      'results found)')
    .action(breaches);
};
