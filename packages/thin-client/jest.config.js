const esModules = ['@polkadot/', '@unique-nft/unique-mainnet-types'].join('|');

module.exports = {
  displayName: 'thin-client',
  preset: '../../jest.preset.js',
  maxWorkers: 1,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  transformIgnorePatterns: [`/!node_modules`],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/accounts',
  testPathIgnorePatterns: ['./utils/*'],
};
