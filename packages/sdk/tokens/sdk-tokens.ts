import '@unique-nft/unique-mainnet-types/augment-api';

import { MutationMethodWrap, QueryMethod } from '@unique-nft/sdk/extrinsics';
import type {
  UnsignedTxPayload,
  TokenInfo,
  CreateTokenArguments,
} from '@unique-nft/sdk/types';
import { UpDataStructsTokenData } from '@unique-nft/unique-mainnet-types';
import { Sdk } from '@unique-nft/sdk';
import { decodeToken } from './utils/decode-token';
import { encodeToken } from './utils/encode-token';
import { NestTokenMutation } from './methods/nest-token';
import { UnnestTokenMutation } from './methods/unnest-token';
import { tokenChildrenQuery } from './methods/token-children';
import { tokenParentQuery } from './methods/token-parent';
import {
  BurnTokenArguments,
  NestTokenArguments,
  NestTokenResult,
  TokenChildrenArguments,
  TokenChildrenResult,
  TokenIdArguments,
  TransferTokenArguments,
  UnnestTokenArguments,
  UnnestTokenResult,
  TokenParentArguments,
  TokenParentResult,
} from './types';

export class SdkTokens {
  constructor(readonly sdk: Sdk) {
    this.nestToken = new NestTokenMutation(this.sdk);
    this.unnestToken = new UnnestTokenMutation(this.sdk);
    this.tokenChildren = tokenChildrenQuery.bind(this.sdk);
    this.tokenParent = tokenParentQuery.bind(this.sdk);
  }

  nestToken: MutationMethodWrap<NestTokenArguments, NestTokenResult>;

  unnestToken: MutationMethodWrap<UnnestTokenArguments, UnnestTokenResult>;

  tokenChildren: QueryMethod<TokenChildrenArguments, TokenChildrenResult>;

  tokenParent: QueryMethod<TokenParentArguments, TokenParentResult>;

  async get({
    collectionId,
    tokenId,
  }: TokenIdArguments): Promise<TokenInfo | null> {
    const collection = await this.sdk.collections.get({ collectionId });

    if (!collection) return null;

    const tokenData: UpDataStructsTokenData =
      await this.sdk.api.rpc.unique.tokenData(collectionId, tokenId);

    if (!tokenData) return null;

    return decodeToken(collection, tokenId, tokenData);
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
