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
  const { packageName, entryPoints, distDir, ignorePatterns } = options;

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
    packageName,
    ignorePatterns,
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

    const generateResult = await bundle.generate({
      format: config.output.format,
    });

    allBundles.push({
      input: config.input,
      file: config.output.file,
      imports: generateResult.output[0].imports,
    });

    generateResult.output.forEach((output) => {
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
