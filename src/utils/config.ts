import Conf from 'conf';
import * as pkg from '../../package.json';

const config = new Conf<string>({
  projectName: pkg.name,
  schema: {
    apiKey: { type: 'string' },
  },
});

export default config;
