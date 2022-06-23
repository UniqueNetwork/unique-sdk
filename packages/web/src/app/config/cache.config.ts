export enum CacheType {
  DEFAULT = 'Default',
  REDIS = 'Redis',
}

interface CacheConfigBase {
  type: CacheType;
  ttl: number;
}

export interface DefaultCacheConfig extends CacheConfigBase {
  type: CacheType.DEFAULT;
}

export interface RedisCacheConfig extends CacheConfigBase {
  type: CacheType.REDIS;
  host: string;
  port: number;
  db: number;
}

export type CacheConfig = DefaultCacheConfig | RedisCacheConfig;

export function createCacheConfig(env: Record<string, string>): CacheConfig {
  const { CACHE_TTL, REDIS_HOST, REDIS_PORT, REDIS_DB } = env;
  const ttl = +CACHE_TTL || 600;

  if (REDIS_HOST) {
    return {
      type: CacheType.REDIS,
      host: REDIS_HOST,
      port: +REDIS_PORT || 6379,
      db: +REDIS_DB || 0,
      ttl,
    };
  }

  return {
    type: CacheType.DEFAULT,
    ttl,
  };
}
