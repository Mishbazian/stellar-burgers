import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@pages': '<rootDir>/src/pages',
    '@components': '<rootDir>/src/components',
    '@ui': '<rootDir>/src/components/ui',
    '@ui-pages': '<rootDir>/src/components/ui/pages',
    '@utils-types': '<rootDir>/src/utils/types',
    '@api': '<rootDir>/src/utils/burger-api.ts',
    '@slices': '<rootDir>/src/services/slices',
    '@selectors': '<rootDir>/src/services/selectors'
  }
};
export default config;
