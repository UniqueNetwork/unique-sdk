import { Sdk } from './sdk';

type Constructor<T, S> = new (sdk: S) => T;

/**
 * add feature to Sdk
 * @param key
 * @param FeatureConstructor
 */
export function addFeature<T, S = Sdk>(
  key: string,
  FeatureConstructor: Constructor<T, S>,
): void {
  const privateKey = `_${key}`;

  Object.defineProperty(Sdk.prototype, key, {
    get(): T {
      if (!this[privateKey]) {
        this[privateKey] = new FeatureConstructor(this);
      }

      return this[privateKey];
    },
  });
}
