import Conf from 'conf';
import { pkg } from './utils';

export const config = new Conf<{ apiKey: string }>({
  projectName: pkg.name,
  schema: {
    apiKey: { type: 'string' },
  },
});
