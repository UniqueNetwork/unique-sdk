import { createConfig } from '../../rollup.config.base';

const mainPackageJson = require('../../package.json');
const currentPackageJson = require('./package.json');

const entryPoints = ['./src/index.ts'];

const allConfigs = createConfig({
  packageName: 'thin-client',
  entryPoints,
  mainPackageJson,
  currentPackageJson,
});

export default allConfigs;
