import '@unique-nft/types/augment-api-rpc';
import '@unique-nft/types/augment-api-tx';
import '@unique-nft/types/augment-api-query';

import { unique } from '@unique-nft/types/definitions';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { InvalidSignerError } from '@unique-nft/sdk/errors';
import {
  ISdk,
  ISdkBalance,
  ISdkCollection,
  ISdkExtrinsics,
  ISdkQuery,
  ISdkToken,
  SdkOptions,
  SignerOptions,
  SignerType,
} from '../types';
import { SkdQuery } from './skd-query';
import { SdkExtrinsics } from './sdk-extrinsics';
import { SdkCollection } from './sdk-collection';
import { SdkToken } from './sdk-token';
import { SdkBalance } from './sdk-balance';
import { SdkSigner, SeedSigner } from './sdk-signers';

export class Sdk implements ISdk {
  readonly isReady: Promise<boolean>;

  readonly api: ApiPromise;

  readonly signer?: SdkSigner;

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

  constructor(private readonly options: SdkOptions) {
    const provider = new WsProvider(this.options.chainWsUrl);

    this.api = new ApiPromise({
      provider,
      rpc: {
        unique: unique.rpc,
      },
    });

    if (options.signer) {
      this.signer = Sdk.createSigner(this.options.signer!);
    }

    this.isReady = this.api.isReady.then(() => true);

    this.query = new SkdQuery(this.options, this.api);
    this.extrinsics = new SdkExtrinsics(this.api, this.signer);
    this.collection = new SdkCollection(this.api, this.extrinsics);
    this.token = new SdkToken(this.api, this.extrinsics, this.query);
    this.balance = new SdkBalance(this.extrinsics, this.api);
  }

  private static createSigner(signerOptions: SignerOptions): SdkSigner {
    switch (signerOptions.type) {
      case SignerType.SEED:
        return new SeedSigner(signerOptions.seed!);
      default:
        throw new InvalidSignerError();
    }
  }
}
