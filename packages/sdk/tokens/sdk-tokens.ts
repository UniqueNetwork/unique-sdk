import '@unique-nft/unique-mainnet-types/augment-api';

import { ApiPromise } from '@polkadot/api';
import { SdkExtrinsics } from '@unique-nft/sdk/extrinsics';
import type {
  UnsignedTxPayload,
  TokenInfo,
  CreateTokenArguments,
  SdkOptions,
} from '@unique-nft/sdk/types';
import { UpDataStructsTokenData } from '@unique-nft/unique-mainnet-types';
import { decodeToken } from './utils/decode-token';
import { encodeToken } from './utils/encode-token';
import { SdkCollections } from './sdk-collections';
import {
  BurnTokenArguments,
  TokenIdArguments,
  TransferTokenArguments,
} from './mutations/collection-by-id/types';

interface Sdk {
  api: ApiPromise;
  extrinsics: SdkExtrinsics;
  options: SdkOptions;
  collections: SdkCollections;
}

export class SdkTokens {
  constructor(readonly sdk: Sdk) {}

  async get({
    collectionId,
    tokenId,
  }: TokenIdArguments): Promise<TokenInfo | null> {
    const collection = await this.sdk.collections.get({ collectionId });

    if (!collection) return null;

    const tokenData: UpDataStructsTokenData =
      await this.sdk.api.rpc.unique.tokenData(collectionId, tokenId);

    if (!tokenData) return null;

    return decodeToken(collection, tokenId, tokenData, this.sdk.options);
  }

  async create(args: CreateTokenArguments): Promise<UnsignedTxPayload> {
    const { address, owner, collectionId, constData } = args;

    const collection = await this.sdk.collections.get({ collectionId });

    if (!collection) throw new Error(`no collection ${collectionId}`);

    const { constOnChainSchema } = collection.properties;

    const tokenPayload = encodeToken(constData, constOnChainSchema);

    return this.sdk.extrinsics.build({
      address,
      section: 'unique',
      method: 'createItem',
      args: [collectionId, { substrate: owner || address }, tokenPayload],
    });
  }

  transfer({
    from,
    to,
    collectionId,
    tokenId,
  }: TransferTokenArguments): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build({
      address: from,
      section: 'unique',
      method: 'transfer',
      args: [{ substrate: to }, collectionId, tokenId, 1],
    });
  }

  burn({
    address,
    collectionId,
    tokenId,
  }: BurnTokenArguments): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build({
      address,
      section: 'unique',
      method: 'burnItem',
      args: [collectionId, tokenId, 1],
    });
  }
}
