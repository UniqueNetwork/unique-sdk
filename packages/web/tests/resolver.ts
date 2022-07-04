/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');

const ipfsUtils = `ipfs-core-utils${path.sep}`;
const ipfsUtilsCjs = `ipfs-core-utils${path.sep}cjs${path.sep}src${path.sep}`;

const appDir = path.join(path.dirname(require.main.filename), '..', '..', '..');

const uniqReg = /@unique-nft\/(?<name>sdk|accounts)(\/(?<libPath>.+))?/;
module.exports = (request, options) => {
  const exec = uniqReg.exec(request);
  if (exec) {
    const { name, libPath } = exec.groups;
    const dirPath = `${appDir}/packages/${name}`;
    if (!libPath) {
      return `${dirPath}/index.ts`;
    }
    const indexPath = `${dirPath}/${libPath}/index.ts`;
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }

    return `${dirPath}/${libPath}.ts`;
  }

  let modulePath;
  try {
    modulePath = options.defaultResolver(request, options);
  } catch (e) {
    return null;
  }
  if (!modulePath) return null;

  if (request.indexOf('ipfs-core-utils') > -1) {
    if (modulePath.indexOf(ipfsUtils) > -1 && !modulePath.endsWith('.js')) {
      return `${modulePath.split(ipfsUtils).join(ipfsUtilsCjs)}.js`;
    }
  }
  return modulePath;
};
