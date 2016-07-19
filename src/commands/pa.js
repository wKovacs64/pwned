import getPastes from '../actions/getPastes';

/**
 * Initializes the 'pa' command.
 *
 * @param {Object} program the Commander instance
 * @returns {undefined}
 */
export default (program) => {
  program
      .command('pa <email>')
      .description('get all pastes for an account (email address)')
      .option('-r, --raw', 'output the raw JSON data')
      .action((email, options) => {
        email = email.trim();
        if (email.length) {
          getPastes(email, options.raw);
        } else {
          program.help();
        }
      });
};
