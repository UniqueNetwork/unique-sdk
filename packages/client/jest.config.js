const esModules = ['@polkadot/', '@unique-nft/'].join('|');

module.exports = {
  displayName: 'client',
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
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/accounts',
  testPathIgnorePatterns: ['./utils/*'],
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.js'],
};
