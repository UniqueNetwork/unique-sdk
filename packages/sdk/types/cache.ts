export interface CacheStoreSetOptions<T> {
  ttl?: ((value: T) => number) | number;
}

export interface CacheStore {
  set<T>(
    key: string,
    value: T,
    options?: CacheStoreSetOptions<T>,
  ): Promise<void> | void;
  get<T>(key: string): Promise<T | undefined> | T | undefined;
  del?(key: string): void | Promise<void>;
}
