const mainPackageJson = require('../../package.json');
const currentPackageJson = require('./package.json');
import { createConfig } from '../../rollup.config.base';

const entryPoints = [
  './index.ts',
  './sign/index.ts',
  './sign/polkadot/index.ts',
];

const allConfigs = createConfig({
  packageName: 'accounts',
  entryPoints,
  mainPackageJson,
  currentPackageJson,
});

export default allConfigs;
