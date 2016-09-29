import getBreach from '../api/getBreach';

export default (name, options) => {
  const breachName = name.trim();
  if (breachName.length) {
    getBreach(breachName, options.raw);
  } else {
    options.help();
  }
};
