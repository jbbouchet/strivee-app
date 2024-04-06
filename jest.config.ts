import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  rootDir: 'src',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^@strivee-api/test(.*)$': '<rootDir>/../test/$1',
    '^@strivee-api(.*)$': '<rootDir>/$1',
  },
};

export default config;
