const mainPackageJson = require('../../package.json');
const currentPackageJson = require('./package.json');
import { createConfig } from '../../rollup.config.base';

const entryPoints = [
  './index.ts',
  './extrinsics/index.ts',
  './balance/index.ts',
  './state-queries/index.ts',
  './tokens/index.ts',
  './utils/index.ts',
  './types/index.ts',
  './errors/index.ts',
];

const allConfigs = createConfig({
  packageName: 'sdk',
  entryPoints,
  mainPackageJson,
  currentPackageJson,
});

export default allConfigs;
