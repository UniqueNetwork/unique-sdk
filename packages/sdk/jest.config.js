require('dotenv').config();

const esModules = ['@polkadot/', '@unique-nft/'].join('|');

const maxWorkers = process.env.TEST_RICH_ACCOUNTS
  ? process.env.TEST_RICH_ACCOUNTS.split(',').length
  : 1;

module.exports = {
  displayName: 'sdk',
  preset: '../../jest.preset.js',
  maxWorkers,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/sdk',
  testPathIgnorePatterns: ['./utils/*'],
};
