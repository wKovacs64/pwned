import ora from 'ora';

const spinner = ora({
  spinner: 'dots',
  text: 'Fetching data...',
});

export default spinner;
