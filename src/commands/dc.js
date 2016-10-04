import dc from '../actions/dc';

/**
 * Initializes the 'dc' command.
 *
 * @param {Object} program the Commander instance
 * @returns {undefined}
 */
export default program => (
  program
    .command('dc')
    .description('get all data classes in the system')
    .option('-r, --raw', 'output the raw JSON data')
    .action(dc)
);
