import { ApiPromise } from '@polkadot/api';
import { SdkExtrinsics, UnsignedTxPayload } from '@unique-nft/sdk/extrinsics';
import type {
  BurnTokenArgs,
  CreateTokenArgs,
  ISdkQuery,
  ISdkToken,
  TransferTokenArgs,
} from '@unique-nft/sdk/types';
import { encodeToken } from './utils/encode-token';

interface Sdk {
  api: ApiPromise;
  extrinsics: SdkExtrinsics;
  query: ISdkQuery;
}

export class SdkToken implements ISdkToken {
  constructor(readonly sdk: Sdk) {}

  async create(token: CreateTokenArgs): Promise<UnsignedTxPayload> {
    const { address, collectionId, constData } = token;

    const collection = await this.sdk.query.collection({ collectionId });

    if (!collection) throw new Error(`no collection ${collectionId}`);

    const { constOnChainSchema } = collection;

    const tokenPayload = encodeToken(constData, constOnChainSchema);

    return this.sdk.extrinsics.build({
      address,
      section: 'unique',
      method: 'createItem',
      args: [collectionId, { substrate: address }, tokenPayload],
    });
  }

  transfer({
    from,
    to,
    collectionId,
    tokenId,
  }: TransferTokenArgs): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build({
      address: from,
      section: 'unique',
      method: 'transfer',
      args: [to, collectionId, tokenId, 1],
    });
  }

  burn({
    address,
    collectionId,
    tokenId,
  }: BurnTokenArgs): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build({
      address,
      section: 'unique',
      method: 'burnItem',
      args: [collectionId, tokenId, 1],
    });
  }
}
