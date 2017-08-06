import pw from '../actions/pw';

/**
 * Initializes the 'pw' command.
 *
 * @param {Object} program the Commander instance
 * @returns {undefined}
 */
export default program =>
  program
    .command('pw <password>')
    .description(
      'check a password (plain text or SHA1 hash) for public exposure',
    )
    .option('-s, --sha1', 'password itself is a SHA1 hash (so hash it again)')
    .option('-r, --raw', 'disable the console spinner')
    .action(pw);
