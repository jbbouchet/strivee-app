import type { Config } from 'jest';

import defaultConfig from './jest-ci.config';

const config: Config = {
  ...defaultConfig,
  collectCoverage: true,
  collectCoverageFrom: ['test/**/*.{js,jsx,ts}', 'src/**/*.{js,jsx,ts}', '!**/node_modules/**', '!**/vendor/**', '!./*.json'],
  coveragePathIgnorePatterns: ['node_modules', '.module.ts', '<rootDir>/src/main.ts', '<rootDir>/src/populate-db.ts', '.mock.ts', '.entity.ts'],
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'html'],
  coverageDirectory: 'coverage',
};

export default config;
