import Conf from 'conf';

const config = new Conf<string>({
  schema: {
    apiKey: { type: 'string' },
  },
});

export default config;
