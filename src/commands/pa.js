import pa from '../actions/pa';

/**
 * Initializes the 'pa' command.
 *
 * @param {Object} program the Commander instance
 * @returns {undefined}
 */
export default program =>
  program
    .command('pa <email>')
    .description('get all pastes for an account (email address)')
    .option(
      '-r, --raw',
      'output the raw JSON data (or nothing, if no results found)',
    )
    .action(pa);
