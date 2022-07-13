import '@unique-nft/unique-mainnet-types/augment-api';

import { MutationMethodWrap, QueryMethod } from '@unique-nft/sdk/extrinsics';
import type {
  UnsignedTxPayload,
  TokenInfo,
  CreateTokenArguments,
} from '@unique-nft/sdk/types';
import { UpDataStructsTokenData } from '@unique-nft/unique-mainnet-types';
import { Sdk } from '@unique-nft/sdk';
import { UniqueTokenDecoded } from '@unique-nft/api';

import { decodeToken } from './utils/decode-token';
import { encodeToken } from './utils/encode-token';
import { NestTokenMutation } from './methods/nest-token';
import { UnnestTokenMutation } from './methods/unnest-token';
import { tokenChildrenQuery } from './methods/token-children';
import { tokenParentQuery } from './methods/token-parent';
import { topmostTokenOwnerQuery } from './methods/topmost-token-owner';
import { tokenById } from './methods/token-by-id/method';
import {
  DeleteTokenPropertiesMutation,
  DeleteTokenPropertiesArguments,
  DeleteTokenPropertiesResult,
} from './methods/delete-token-properties';
import {
  SetTokenPropertiesMutation,
  SetTokenPropertiesArguments,
  SetTokenPropertiesResult,
} from './methods/set-token-properties';
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
  TopmostTokenOwnerArguments,
  TopmostTokenOwnerResult,
} from './types';
import {
  CreateTokenNewArguments,
  CreateTokenNewMutation,
} from './methods/create-token';

export class SdkTokens {
  constructor(readonly sdk: Sdk) {
    this.nest = new NestTokenMutation(this.sdk);
    this.unnest = new UnnestTokenMutation(this.sdk);
    this.children = tokenChildrenQuery.bind(this.sdk);
    this.parent = tokenParentQuery.bind(this.sdk);
    this.topmostOwner = topmostTokenOwnerQuery.bind(this.sdk);
    this.get_new = tokenById.bind(this.sdk);
    this.create_new = new CreateTokenNewMutation(this.sdk);
    this.setProperties = new SetTokenPropertiesMutation(this.sdk);
    this.deleteProperties = new DeleteTokenPropertiesMutation(this.sdk);
  }

  nest: MutationMethodWrap<NestTokenArguments, NestTokenResult>;

  unnest: MutationMethodWrap<UnnestTokenArguments, UnnestTokenResult>;

  children: QueryMethod<TokenChildrenArguments, TokenChildrenResult>;

  parent: QueryMethod<TokenParentArguments, TokenParentResult>;

  get_new: QueryMethod<TokenIdArguments, UniqueTokenDecoded>;

  create_new: MutationMethodWrap<CreateTokenNewArguments, TokenIdArguments>;

  topmostOwner: QueryMethod<
    TopmostTokenOwnerArguments,
    TopmostTokenOwnerResult
  >;

  setProperties: MutationMethodWrap<
    SetTokenPropertiesArguments,
    SetTokenPropertiesResult
  >;

  deleteProperties: MutationMethodWrap<
    DeleteTokenPropertiesArguments,
    DeleteTokenPropertiesResult
  >;

  async get({
    collectionId,
    tokenId,
  }: TokenIdArguments): Promise<TokenInfo | null> {
    const collection = await this.sdk.collections.get({ collectionId });

    if (!collection) return null;

    const exists = await this.sdk.api.rpc.unique.tokenExists(
      collectionId,
      tokenId,
    );

    if (!exists.toHuman()) {
      return null;
    }

    const tokenData: UpDataStructsTokenData =
      await this.sdk.api.rpc.unique.tokenData(collectionId, tokenId);

    if (!tokenData) return null;

    let owner = null;
    if (!(tokenData.owner.value.toHuman() as any)) {
      owner = await this.sdk.api.rpc.unique.tokenOwner(collectionId, tokenId);
    }

    const tokenDataWithOwner = owner ? { ...tokenData, ...owner } : tokenData;

    return decodeToken(
      collection,
      tokenId,
      tokenDataWithOwner as UpDataStructsTokenData,
    );
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
