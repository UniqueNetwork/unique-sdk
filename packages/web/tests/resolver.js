// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const ipfsUtils = `ipfs-core-utils${path.sep}`;
const ipfsUtilsCjs = `ipfs-core-utils${path.sep}cjs${path.sep}src${path.sep}`;

const appDir = path.join(path.dirname(require.main.filename), '..', '..', '..');

const uniqReg = /@unique-nft\/sdk(\/(?<sdkPath>.+))?/;
module.exports = (request, options) => {
  const exec = uniqReg.exec(request);
  if (exec) {
    const { sdkPath } = exec.groups;
    return `${appDir}/packages/sdk/${sdkPath || 'src'}/index.ts`;
  }
  let modulePath;
  try {
    modulePath = options.defaultResolver(request, options);
  } catch (e) {
    return;
  }
  if (!modulePath) return;

  if (request.indexOf('ipfs-core-utils') > -1) {
    if (modulePath.indexOf(ipfsUtils) > -1 && !modulePath.endsWith('.js')) {
      return modulePath.split(ipfsUtils).join(ipfsUtilsCjs) + '.js';
    }
  }
  return modulePath;
};
