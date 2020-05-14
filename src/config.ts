import Conf from 'conf';
import * as pkg from '../package.json';

export const config = new Conf<{ apiKey: string }>({
  projectName: pkg.name,
  schema: {
    apiKey: { type: 'string' },
  },
});
