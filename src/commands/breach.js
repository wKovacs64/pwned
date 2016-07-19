import getBreach from '../actions/getBreach';

/**
 * Initializes the 'breach' command.
 *
 * @param {Object} program the Commander instance
 * @returns {undefined}
 */
export default (program) => {
  program
      .command('breach <name>')
      .description('get a single breached site by breach name')
      .option('-r, --raw', 'output the raw JSON data (or nothing, if no ' +
          'results found)')
      .action((name, options) => {
        name = name.trim();
        if (name.length) {
          getBreach(name, options.raw);
        } else {
          program.help();
        }
      });
};
