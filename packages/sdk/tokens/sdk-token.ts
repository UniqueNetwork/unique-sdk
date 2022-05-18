import '@unique-nft/types/augment-api';

import { ApiPromise } from '@polkadot/api';
import { SdkExtrinsics } from '@unique-nft/sdk/extrinsics';
import { UnsignedTxPayload , ISdkCollection, TokenIdArg, TokenInfo } from '@unique-nft/sdk/types';
import type {
  BurnTokenArgs,
  CreateTokenArgs,
  ISdkQuery,
  ISdkToken,
  TransferTokenArgs,
  SdkOptions,
} from '@unique-nft/sdk/types';
import { Option } from '@polkadot/types-codec';
import { PalletNonfungibleItemData } from '@unique-nft/types';
import { decodeToken } from './utils/decode-token';
import { encodeToken } from './utils/encode-token';

interface Sdk {
  api: ApiPromise;
  extrinsics: SdkExtrinsics;
  query: ISdkQuery;
  options: SdkOptions;
  collection: ISdkCollection;
}

export class SdkToken implements ISdkToken {
  constructor(readonly sdk: Sdk) {}

  async get({ collectionId, tokenId }: TokenIdArg): Promise<TokenInfo | null> {
    const collection = await this.sdk.collection.get({ collectionId });

    if (!collection) return null;

    const tokenDataOption: Option<PalletNonfungibleItemData> =
      await this.sdk.api.query.nonfungible.tokenData(collectionId, tokenId);

    const tokenData = tokenDataOption.unwrapOr(undefined);

    if (!tokenData) return null;

    return decodeToken(collection, tokenId, tokenData, this.sdk.options);
  }

  async create(token: CreateTokenArgs): Promise<UnsignedTxPayload> {
    const { address, collectionId, constData } = token;

    const collection = await this.sdk.collection.get({ collectionId });

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
