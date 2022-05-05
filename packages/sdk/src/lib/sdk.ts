import '@unique-nft/types/augment-api-rpc';
import '@unique-nft/types/augment-api-tx';
import '@unique-nft/types/augment-api-query';

import { unique } from '@unique-nft/types/definitions';

import { ApiPromise, WsProvider } from '@polkadot/api';
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
import { SdkExtrinsics } from './sdk-extrinsics';
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

  constructor(private readonly options: SdkOptions) {
    const provider = new WsProvider(this.options.chainWsUrl);

    this.api = new ApiPromise({
      provider,
      rpc: {
        unique: unique.rpc,
      },
    });

    this.isReady = this.api.isReady.then(() => true);

    this.query = new SkdQuery(this.options, this.api);
    this.extrinsics = new SdkExtrinsics(this.api);
    this.collection = new SdkCollection(this.api, this.extrinsics);
    this.token = new SdkToken(this.api, this.extrinsics, this.query);
    this.balance = new SdkBalance(this.extrinsics, this.api);
  }
}
