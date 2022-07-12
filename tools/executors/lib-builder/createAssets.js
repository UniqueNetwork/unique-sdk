const path = require('path');
const fs = require('fs');

const createAssets = (options) => {
  const {
    allBundles,
    srcDir,
    distDir,
    mainPackageJson,
    currentPackageJson,
    checkIsEmbedded,
  } = options;
  const allImportsSet = new Set();
  const allExports = {};

  allBundles.forEach(({ file, imports }) => {
    const { dir, ext } = path.parse(file);

    imports.forEach((id) => allImportsSet.add(id));

    let pathRequest = path.relative(distDir, dir);
    pathRequest = pathRequest ? `./${pathRequest}` : '.';
    const pathResult = `./${path.relative(distDir, file)}`;

    const current = allExports[pathRequest] || {};

    if (ext === '.cjs') {
      current.require = pathResult;
    } else if (ext === '.ts') {
      current.types = pathResult;
    } else if (ext === '.js') {
      current.default = pathResult;
    }

    allExports[pathRequest] = JSON.parse(
      JSON.stringify(current, ['types', 'require', 'default']),
    );

    return allExports;
  });

  const dependencies = Object.entries(mainPackageJson.dependencies).reduce(
    (acc, [key, value]) =>
      allImportsSet.has(key) && !checkIsEmbedded(key)
        ? { ...acc, [key]: value }
        : acc,
    {},
  );

  const rootExports = allExports['.'];

  const packageRoots = {
    types: rootExports.types.replace('./', ''),
    main: rootExports.require.replace('./', ''),
    module: rootExports.default.replace('./', ''),
  };

  fs.writeFileSync(
    path.resolve(distDir, 'package.json'),
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
        private: undefined,
      },
      null,
      2,
    ),
  );

  fs.cpSync(
    path.resolve(srcDir, 'README.md'),
    path.resolve(distDir, 'README.md'),
  );
};

module.exports = createAssets;
