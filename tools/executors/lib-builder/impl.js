const { exec } = require('child_process');
const { promisify } = require('util');

async function buildExecutor(options) {
  const command = `npm run build:${options.packageName}`;

  console.info('command', command);

  const { stdout, stderr } = await promisify(exec)(command);

  console.info(stdout);
  console.info(stderr);

  return { success: true };
}

exports['default'] = buildExecutor;
