const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  verbose: true,
  testTimeout: 30_000,
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.js'],
};
