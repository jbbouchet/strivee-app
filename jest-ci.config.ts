import type { Config } from 'jest';

import defaultConfig from './jest.config';

const config: Config = {
  ...defaultConfig,
  maxWorkers: 4,
  rootDir: '.',
  testTimeout: 10_000,
  testRegex: '^(.*\\/)?[^\\/]+(?:\\.spec|\\.e2e\\-spec)\\.ts$',
  moduleNameMapper: {
    '^@strivee-api/test(.*)$': '<rootDir>/test/$1',
    '^@strivee-api(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
