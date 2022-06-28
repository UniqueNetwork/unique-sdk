import { createCacheConfig } from './cache.config';

describe('cache.config', () => {
  it('ok - default', () => {
    const config = createCacheConfig({});

    expect(config).toMatchObject({
      type: 'Default',
      ttl: 600,
    });
  });

  it('ok - redis', () => {
    const config = createCacheConfig({
      REDIS_HOST: 'redis.host',
      REDIS_PORT: '1234',
      REDIS_DB: '1',
      CACHE_TTL: '300',
    });

    expect(config).toMatchObject({
      type: 'Redis',
      host: 'redis.host',
      port: 1234,
      db: 1,
      ttl: 300,
    });
  });
});
