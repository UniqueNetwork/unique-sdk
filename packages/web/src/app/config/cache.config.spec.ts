import * as process from 'process';
import { createCacheConfig } from './cache.config';

describe('cache.config', () => {
  it('ok - default', () => {
    const config = createCacheConfig();

    expect(config).toMatchObject({
      type: 'Default',
      ttl: 600,
    });
  });

  it('ok - redis', () => {
    process.env.REDIS_HOST = 'redis.host';
    process.env.REDIS_PORT = '1234';
    process.env.REDIS_DB = '1';
    process.env.CACHE_TTL = '300';

    const config = createCacheConfig();

    expect(config).toMatchObject({
      type: 'Redis',
      host: 'redis.host',
      port: 1234,
      db: 1,
      ttl: 300,
    });
  });
});
