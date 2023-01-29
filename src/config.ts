import Conf from 'conf';
import { pkg } from './utils/pkg.js';

export const config = new Conf<{ apiKey: string }>({
  projectName: pkg.name,
  schema: {
    apiKey: { type: 'string' },
  },
});
