import '@unique-nft/types/augment-api-rpc';
import '@unique-nft/types/augment-api-tx';
import '@unique-nft/types/augment-api-query';

import { unique } from '@unique-nft/types/definitions';

import { ApiPromise, WsProvider } from '@polkadot/api';

import { SdkExtrinsics } from '@unique-nft/sdk/extrinsics';
import {
  SdkOptions,
  ISdk,
  ISdkQuery,
  ISdkExtrinsics,
  ISdkCollection,
  ISdkToken,
  ISdkBalance,
} from '../types';
import { SkdQuery } from './skd-query';
import { SdkCollection } from './sdk-collection';
import { SdkToken } from './sdk-token';
import { SdkBalance } from './sdk-balance';

export class Sdk implements ISdk {
  readonly isReady: Promise<boolean>;

  readonly api: ApiPromise;

  readonly extrinsics: ISdkExtrinsics;

  readonly query: ISdkQuery;

  readonly balance: ISdkBalance;

  collection: ISdkCollection;

  token: ISdkToken;

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

    this.query = new SkdQuery(this);
    this.extrinsics = new SdkExtrinsics(this);
    this.collection = new SdkCollection(this);
    this.token = new SdkToken(this);
    this.balance = new SdkBalance(this);
  }
}
