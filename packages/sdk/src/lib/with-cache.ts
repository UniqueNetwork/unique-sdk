import { CacheStore } from '@unique-nft/sdk/types';

/* eslint-disable no-underscore-dangle */

export class WithCache {
  private _cache: CacheStore;

  useCache(cache: CacheStore) {
    if (this._cache) {
      throw new Error(`Already initialized`);
    }

    this._cache = cache;
  }

  get cache(): CacheStore | undefined {
    return this._cache;
  }
}
