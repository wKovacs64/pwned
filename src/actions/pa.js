import getPastes from '../api/getPastes';

export default (email, options) => {
  const mail = email.trim();
  if (mail.length) {
    getPastes(mail, options.raw);
  } else {
    options.help();
  }
};
