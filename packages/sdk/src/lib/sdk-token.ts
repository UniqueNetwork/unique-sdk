import { ApiPromise } from '@polkadot/api';
import type {
  BurnTokenArgs,
  CreateTokenArgs,
  ISdkExtrinsics,
  ISdkQuery,
  ISdkToken,
  TransferTokenArgs,
  UnsignedTxPayload,
} from '../types';
import { serializeConstData } from '../utils/protobuf.utils';
import { u8aToHex } from '@polkadot/util';

export class SdkToken implements ISdkToken {
  constructor(
    readonly api: ApiPromise,
    readonly extrinsics: ISdkExtrinsics,
    readonly query: ISdkQuery,
  ) {}

  async create(token: CreateTokenArgs): Promise<UnsignedTxPayload> {
    const { address, collectionId, constData } = token;

    const collection = await this.query.collection({ collectionId });

    if (!collection) throw new Error(`no collection ${collectionId}`);

    const { constOnChainSchema } = collection;

    const tokenData =
      constData && constOnChainSchema
        ? {
            nft: {
              constData: u8aToHex(
                serializeConstData(constData, constOnChainSchema),
              ),
            },
          }
        : { nft: null };

    return this.extrinsics.build({
      address,
      section: 'unique',
      method: 'createItem',
      args: [collectionId, { substrate: address }, tokenData],
    });
  }

  burn({
    address,
    collectionId,
    tokenId,
  }: BurnTokenArgs): Promise<UnsignedTxPayload> {
    return this.extrinsics.build({
      address,
      section: 'unique',
      method: 'burnItem',
      args: [collectionId, tokenId, 1],
    });
  }

  transfer({
    from,
    to,
    collectionId,
    tokenId,
  }: TransferTokenArgs): Promise<UnsignedTxPayload> {
    return this.extrinsics.build({
      address: from,
      section: 'unique',
      method: 'transferItem',
      args: [to, collectionId, tokenId, 1],
    });
  }
}
