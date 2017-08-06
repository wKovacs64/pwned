import getPwnedPassword from '../api/getPwnedPassword';

export default (password, options) => {
  if (password.trim().length) {
    getPwnedPassword(password, options.sha1, options.raw);
  } else {
    options.help();
  }
};
