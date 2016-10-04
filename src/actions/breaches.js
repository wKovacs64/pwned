import getBreaches from '../api/getBreaches';

export default options => getBreaches(options.domainFilter, options.raw);
