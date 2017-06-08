import ba from './ba';
import breach from './breach';
import breaches from './breaches';
import dc from './dc';
import pa from './pa';
import search from './search';

/**
 * Initializes all the commands.
 *
 * @param {Object} program the Commander instance
 * @returns {undefined}
 */
export default (program) => {
  ba(program);
  breach(program);
  breaches(program);
  dc(program);
  pa(program);
  search(program);
};
