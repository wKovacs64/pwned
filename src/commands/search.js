import search from '../actions/search';

/**
 * Initializes the 'search' command.
 *
 * @param {Object} program the Commander instance
 * @returns {undefined}
 */
export default program =>
  program
    .command('search <account>')
    .description(
      'search breaches and pastes for an account (username or email address)',
    )
    .option('-d, --domain-filter <domain>', 'filter breach data by domain')
    .option(
      '-r, --raw',
      'output the raw JSON data (or nothing, if no results found)',
    )
    .option(
      '-t, --truncate',
      'truncate breach data to just the name of each breach',
    )
    .action(search);
