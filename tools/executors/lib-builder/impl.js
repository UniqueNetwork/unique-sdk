const { rollup } = require('rollup');
const fs = require('fs');
const path = require('path');

const mainPackageJson = require('../../../package.json');
const createConfigs = require('./createConfigs');
const createAssets = require('./createAssets');

const EMBEDDED_DEPS = ['@unique-nft/unique-mainnet-types'];

const checkIsEmbedded = (id) =>
  EMBEDDED_DEPS.some((embedded) => id.includes(embedded));

async function buildExecutor(options, globalOptions) {
  const { packageName, entryPoints, distDir } = options;

  const { sourceRoot } = globalOptions.workspace.projects[packageName];

  const srcDir = path.resolve(sourceRoot, '..');

  const currentPackageJson = require(path.resolve(srcDir, 'package.json'));

  await createDir(distDir);

  const configsList = createConfigs({
    srcDir,
    distDir,
    entryPoints,
    checkIsEmbedded,
  });

  const allBundles = await runRollup(configsList, distDir);

  await createAssets({
    allBundles,
    srcDir,
    distDir,
    mainPackageJson,
    currentPackageJson,
    checkIsEmbedded,
  });

  return { success: true };
}

async function runRollup(configsList, distDir) {
  const allBundles = [];

  for (let i = 0; i < configsList.length; i++) {
    const config = configsList[i];

    const { dir } = path.parse(config.output.file);

    await createDir(dir);

    const bundle = await rollup(config);

    const writeResult = await bundle.write({
      dir: distDir,
    });

    allBundles.push({
      file: config.output.file,
      imports: writeResult.output[0].imports,
    });

    writeResult.output.forEach((output) => {
      fs.writeFileSync(config.output.file, output.code);
    });
  }

  return allBundles;
}

async function createDir(dirPath) {
  try {
    await fs.promises.stat(dirPath);
  } catch (err) {
    await fs.promises.mkdir(dirPath, {
      recursive: true,
    });
  }
}

exports['default'] = buildExecutor;
