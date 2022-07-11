const dts = require('rollup-plugin-dts').default;
const esbuild = require('rollup-plugin-esbuild').default;
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const fs = require('fs');
const path = require('path');

const ts = require('typescript');

function createConfigs(options) {
  const { entryPoints, srcDir, distDir, checkIsEmbedded } = options;

  const TS_CONFIG = 'tsconfig.lib.json';

  const INTERNAL_IDS = entryPoints.map((e) => path.join(srcDir, e));

  const checkIsExternal = (id) => {
    const isInternal =
      /^[./]/.test(id) || INTERNAL_IDS.includes(id) || checkIsEmbedded(id);

    return !isInternal;
  };

  const parsedTsConfig = ts.readConfigFile(path.join(srcDir, TS_CONFIG), (p) =>
    fs.readFileSync(p, 'utf8'),
  ).config;

  const DTS_CONFIG = {
    compilerOptions: {
      paths: parsedTsConfig.compilerOptions.paths,
      baseUrl: '.',
    },
  };

  const getEntryConfig = (relativeInput) => {
    const input = path.join(srcDir, relativeInput);
    const { dir, name } = path.parse(path.join(distDir, relativeInput));
    const outFile = path.join(dir, name);

    const getBundleConfig = (config) => ({
      ...config,
      plugins: [...config.plugins, commonjs(), nodeResolve()],
      input,
      external: checkIsExternal,
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

  return entryPoints.reduce(
    (acc, entry) => [...acc, ...getEntryConfig(entry)],
    [],
  );
}

module.exports = createConfigs;
