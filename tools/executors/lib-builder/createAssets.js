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
    packageName,
    ignorePatterns,
  } = options;
  const allImportsSet = new Set();
  const allExports = {};
  const filesUseImport = {};

  allBundles.forEach(({ input, file, imports }) => {
    const { dir, ext } = path.parse(file);

    imports.forEach((id) => {
      allImportsSet.add(id);
      filesUseImport[id] = filesUseImport[id] || new Set();
      filesUseImport[id].add(input);
    });

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
    (acc, [key, value]) => {
      if (allImportsSet.has(key) && !checkIsEmbedded(key)) {
        checkIgnorePatterns(packageName, ignorePatterns, key, filesUseImport);
        return { ...acc, [key]: value };
      }

      return acc;
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

function checkIgnorePatterns(packageName, ignorePatterns, key, filesUseImport) {
  if (!ignorePatterns) return;

  ignorePatterns.forEach((pattern) => {
    if (key.includes(pattern)) {
      const files = Array.from(filesUseImport[key]);
      const splitter = '\n- ';
      const filesStr = files.join(splitter);
      const message = `The package "${packageName}" must not contain a dependency "${key}" in files:${splitter}${filesStr}`;
      throw new Error(message);
    }
  });
}

module.exports = createAssets;
