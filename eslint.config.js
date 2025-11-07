import { defineConfig } from 'eslint/config';
import baseConfig from '@wkovacs64/eslint-config';

const config = defineConfig([
  baseConfig,
  {
    // your optional overrides here
  },
]);

export default config;
