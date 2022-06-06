import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

import fs from 'fs';
import path from 'path';

import ts from 'typescript';

const mainPackageJson = require('../../package.json');
const currentPackageJson = require('./package.json');
const SRC_FOLDER = './packages/sdk';
const TS_CONFIG = 'tsconfig.lib.json';
const DIST_FOLDER = './dist/packages/sdk';
const ENTRY_POINTS = [
  './index.ts',
  './extrinsics/index.ts',
  './sign/index.ts',
  './balance/index.ts',
  './state-queries/index.ts',
  './tokens/index.ts',
  './utils/index.ts',
  './types/index.ts',
];

let bundlesCount = 0;

const allBundles = [];

const checkExternal = (id) => {
  return !/^[./]/.test(id);
};

const parsedTsConfig = ts.readConfigFile(
  path.join(SRC_FOLDER, TS_CONFIG),
  (p) => fs.readFileSync(p, 'utf8'),
).config;

const DTS_CONFIG = {
  compilerOptions: {
    paths: parsedTsConfig.compilerOptions.paths,
    baseUrl: '.',
  },
};

const onGenerateBundle = (options, bundle) => {
  allBundles.push({ options, bundle });

  if (allBundles.length === bundlesCount) {
    let allImportsSet = new Set();
    const allExports = {};

    allBundles.forEach(({ options, bundle }) => {
      const file = './' + options.file;
      const { dir, ext } = path.parse(file);

      Object.values(bundle)[0].imports.forEach((id) => allImportsSet.add(id));

      let pathRequest = path.relative(DIST_FOLDER, dir);
      pathRequest = pathRequest ? './' + pathRequest : '.';
      const pathResult = './' + path.relative(DIST_FOLDER, file);

      const current = allExports[pathRequest] || {};

      switch (ext) {
        case '.cjs': {
          current.require = pathResult;
          break;
        }
        case '.ts': {
          current.types = pathResult;
          break;
        }
        case '.js': {
          current.default = pathResult;
          break;
        }
      }

      const currentSorted = JSON.parse(
        JSON.stringify(current, ['types', 'require', 'default']),
      );

      return (allExports[pathRequest] = currentSorted);
    });

    const dependencies = Object.entries(mainPackageJson.dependencies).reduce(
      (acc, [key, value]) => {
        return allImportsSet.has(key) ? { ...acc, [key]: value } : acc;
      },
      {},
    );

    const rootExports = allExports['.'];

    const packageRoots = {
      types: rootExports.types.replace('./', ''),
      main: rootExports.require.replace('./', ''),
      module: rootExports.default.replace('./', ''),
    };

    fs.writeFileSync(
      path.resolve(DIST_FOLDER, 'package.json'),
      JSON.stringify(
        {
          ...mainPackageJson,
          ...currentPackageJson,
          dependencies,
          type: 'module',
          ...packageRoots,
          exports: allExports,
          scripts: undefined,
          devDependencies: undefined,
          'lint-staged': undefined,
        },
        null,
        2,
      ),
    );
  }
};

const afterAll = { generateBundle: onGenerateBundle };

const getEntryConfig = (relativeInput) => {
  const input = path.join(SRC_FOLDER, relativeInput);
  const { dir, name } = path.parse(path.join(DIST_FOLDER, relativeInput));
  const outFile = path.join(dir, name);

  const getBundleConfig = (config) => ({
    ...config,
    plugins: [...config.plugins, afterAll],
    input,
    external: checkExternal,
  });

  return [
    getBundleConfig({
      plugins: [esbuild()],
      output: {
        file: `${outFile}.cjs`,
        format: 'cjs',
        sourcemap: true,
      },
    }),
    getBundleConfig({
      plugins: [esbuild()],
      output: {
        file: `${outFile}.js`,
        format: 'es',
        sourcemap: true,
      },
    }),
    getBundleConfig({
      plugins: [dts(DTS_CONFIG)],
      output: {
        file: `${outFile}.d.ts`,
        format: 'es',
      },
    }),
  ];
};

const allConfigs = ENTRY_POINTS.reduce(
  (acc, entry) => [...acc, ...getEntryConfig(entry)],
  [],
);

bundlesCount = allConfigs.length;

export default allConfigs;
