import * as fs from 'fs';

if (fs.existsSync('.env')) {
  const envFileStr = fs.readFileSync('.env').toString();
  const envs = envFileStr.split('\n').reduce((e, line) => {
    const [key, value] = line.split('=');
    if (!key.trim()) return e;
    e[key.trim()] = value ? value.trim() : true;
    return e;
  }, {});
  process.env = Object.assign(process.env, envs);
}

if (process.env.TEST_SHOW_LOG !== 'true') {
  global.console = {
    ...console,
    log: () => {},
    error: () => {},
    warn: () => {},
  };
}
