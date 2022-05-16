import '@unique-nft/types/augment-api-rpc';
import '@unique-nft/types/augment-api-tx';
import '@unique-nft/types/augment-api-query';

import { unique } from '@unique-nft/types/definitions';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { InvalidSignerError } from '@unique-nft/sdk/errors';
import { SdkExtrinsics } from '@unique-nft/sdk/extrinsics';
import { SdkSigner, SeedSigner } from '@unique-nft/sdk/sign';
import { validate } from '@unique-nft/sdk/validation';

import {
  ISdk,
  ISdkBalance,
  ISdkCollection,
  ISdkQuery,
  ISdkToken,
  SdkOptions,
  SeedSignerOptions,
  SignerOptions,
  UriSignerOptions,
} from '../types';
import { SkdQuery } from './skd-query';
import { SdkCollection } from './sdk-collection';
import { SdkToken } from './sdk-token';
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

    this.isReady = this.api.isReady.then(() => this.onReady());

    this.extrinsics = new SdkExtrinsics(this);
    this.query = new SkdQuery(this);
    this.collection = new SdkCollection(this);
    this.token = new SdkToken(this);
    this.balance = new SdkBalance(this);
  }

  async onReady() {
    if (this.options.signer) {
      this.signer = await Sdk.createSigner(this.options.signer);
    }
    return true;
  }

  private static async createSigner(
    signerOptions: SignerOptions,
  ): Promise<SdkSigner> {
    if ('seed' in signerOptions) {
      await validate(signerOptions, SeedSignerOptions);
      return new SeedSigner(signerOptions.seed);
    }
    if ('uri' in signerOptions) {
      await validate(signerOptions, UriSignerOptions);
      return new SeedSigner(signerOptions.uri);
    }

    if ('keyfile' in signerOptions) {
      // todo add json signer
      throw new InvalidSignerError();
    }

    throw new InvalidSignerError();
  }
}
