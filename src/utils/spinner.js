import { Spinner } from 'cli-spinner';

const spinner = new Spinner('Fetching data... %s');
spinner.setSpinnerString('|/-\\');

export default spinner;
