import getPastes from '../api/getPastes';

export default (email, options) => {
  email = email.trim();
  if (email.length) {
    getPastes(email, options.raw);
  } else {
    options.help();
  }
};
