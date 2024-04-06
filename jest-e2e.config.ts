import type { Config } from 'jest';

import defaultConfig from './jest.config';

const config: Config = {
  ...defaultConfig,
  maxWorkers: 4,
  testTimeout: 10_000,
  rootDir: '.',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@strivee-api/test(.*)$': '<rootDir>/test/$1',
    '^@strivee-api(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
