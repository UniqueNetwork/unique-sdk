import { CacheModule } from '@nestjs/common';
import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

export const registerCache = () => {
  const { REDIS_HOST, REDIS_PORT, REDIS_DB, CACHE_TTL } = process.env;

  const ttl = +CACHE_TTL || 600;

  if (REDIS_HOST) {
    return CacheModule.register<ClientOpts>({
      store: redisStore,

      host: REDIS_HOST,
      port: +REDIS_PORT || 6379,
      db: +REDIS_DB || 0,

      ttl,
    });
  }

  return CacheModule.register({
    ttl,
  });
};
