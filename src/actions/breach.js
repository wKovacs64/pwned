import getBreach from '../api/getBreach';

export default (name, options) => {
  name = name.trim();
  if (name.length) {
    getBreach(name, options.raw);
  } else {
    options.help();
  }
};
