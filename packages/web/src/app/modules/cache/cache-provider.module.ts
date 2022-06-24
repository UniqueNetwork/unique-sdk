import { CACHE_MANAGER, Global, Module, Provider } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';
import { caching, Cache } from 'cache-manager';

import { CacheConfig, CacheType } from '../../config/cache.config';

const cacheProvider: Provider = {
  inject: [ConfigService],
  provide: CACHE_MANAGER,
  useFactory: (configService: ConfigService): Cache => {
    const cacheConfig: CacheConfig = configService.get('cache');

    switch (cacheConfig.type) {
      case CacheType.DEFAULT:
        return caching({
          ttl: cacheConfig.ttl,

          store: 'memory',
        });
      case CacheType.REDIS:
        return caching({
          ttl: cacheConfig.ttl,

          store: redisStore,
          host: cacheConfig.host,
          port: cacheConfig.port,
          db: cacheConfig.db,
        });
      default:
        throw new Error('Invalid cache config');
    }
  },
};

@Global()
@Module({
  providers: [
    cacheProvider,
  ],
  exports: [
    CACHE_MANAGER,
  ],
})
export class CacheProviderModule {}
