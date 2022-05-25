import { Sdk } from './sdk';

type Constructor<T> = new (sdk: Sdk) => T;

export function addFeature<T>(
  key: string,
  FeatureConstructor: Constructor<T>,
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
