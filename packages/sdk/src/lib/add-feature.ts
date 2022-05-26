import { Sdk } from './sdk';

type Constructor<T, S> = new (sdk: S) => T;

export function addFeature<T, S>(
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
