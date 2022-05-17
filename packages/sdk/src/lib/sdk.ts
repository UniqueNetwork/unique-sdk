import '@unique-nft/types/augment-api-rpc';
import '@unique-nft/types/augment-api-tx';
import '@unique-nft/types/augment-api-query';

import { unique } from '@unique-nft/types/definitions';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { SdkExtrinsics } from '@unique-nft/sdk/extrinsics';

import {
  ISdk,
  ISdkBalance,
  ISdkQuery,
  ISdkCollection,
  ISdkToken,
  SdkOptions,
  SdkSigner,
} from '@unique-nft/sdk/types';
import { SdkCollection, SdkToken } from '@unique-nft/sdk/collections';
import { SkdQuery } from './skd-query';
import { SdkBalance } from './sdk-balance';

export class Sdk implements ISdk {
  readonly isReady: Promise<boolean>;

  readonly api: ApiPromise;

  readonly extrinsics: SdkExtrinsics;

  readonly query: ISdkQuery;

  readonly balance: ISdkBalance;

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
    this.query = new SkdQuery(this);
    this.collection = new SdkCollection(this);
    this.token = new SdkToken(this);
    this.balance = new SdkBalance(this);
  }
}
