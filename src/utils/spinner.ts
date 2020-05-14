import ora from 'ora';

export const spinner = ora({
  spinner: 'dots',
  text: 'Fetching data...',
});
