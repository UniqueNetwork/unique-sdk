import '@unique-nft/types/augment-api';
import { unique } from '@unique-nft/types/definitions';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { SdkExtrinsics } from '@unique-nft/sdk/extrinsics';

import {
  ISdkCollection,
  ISdkToken,
  SdkOptions,
  SdkSigner,
  ChainProperties,
} from '@unique-nft/sdk/types';
import { SdkCollection, SdkToken } from '@unique-nft/sdk/tokens';

export class Sdk {
  readonly isReady: Promise<boolean>;

  readonly api: ApiPromise;

  readonly extrinsics: SdkExtrinsics;

  collection: ISdkCollection;

  token: ISdkToken;

  signer?: SdkSigner;

  static async create(options: SdkOptions): Promise<Sdk> {
    const sdk = new Sdk(options);
    await sdk.isReady;

    return sdk;
  }

  constructor(public readonly options: SdkOptions) {
    const provider = new WsProvider(this.options.chainWsUrl);

    this.api = new ApiPromise({
      provider,
      rpc: {
        unique: unique.rpc,
      },
    });

    this.isReady = this.api.isReady.then(() => true);

    this.signer = this.options.signer;

    this.extrinsics = new SdkExtrinsics(this);
    this.collection = new SdkCollection(this);
    this.token = new SdkToken(this);
  }

  chainProperties(): ChainProperties {
    return {
      SS58Prefix: this.api.registry.chainSS58 || 0,
      token: this.api.registry.chainTokens[0],
      decimals: this.api.registry.chainDecimals[0],
      wsUrl: this.options.chainWsUrl,
      genesisHash: this.api.genesisHash.toHex(), // todo hex?
    };
  }
}

type Constructor<T> = new (...args: any[]) => T;

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
