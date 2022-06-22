import process from 'process';

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

export function createCacheConfig(): CacheConfig {
  const ttl = +process.env.CACHE_TTL || 600;

  if (process.env.REDIS_HOST) {
    return {
      type: CacheType.REDIS,
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT || 6379,
      db: +process.env.REDIS_DB || 0,
      ttl,
    };
  }

  return {
    type: CacheType.DEFAULT,
    ttl,
  };
}
