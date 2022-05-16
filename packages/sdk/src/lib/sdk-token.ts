import { u8aToHex } from '@polkadot/util';
import { UnsignedTxPayload } from '@unique-nft/sdk/extrinsics';
import type {
  BurnTokenArgs,
  CreateTokenArgs,
  ISdkToken,
  TransferTokenArgs,
} from '../types';
import { serializeConstData } from '../utils/protobuf.utils';
import { Sdk } from './sdk';

export class SdkToken implements ISdkToken {
  constructor(
    readonly sdk: Sdk,
  ) {}

  async create(token: CreateTokenArgs): Promise<UnsignedTxPayload> {
    const { address, collectionId, constData } = token;

    const collection = await this.sdk.query.collection({ collectionId });

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

    return this.sdk.extrinsics.build({
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
    return this.sdk.extrinsics.build({
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
    return this.sdk.extrinsics.build({
      address: from,
      section: 'unique',
      method: 'transfer',
      args: [to, collectionId, tokenId, 1],
    });
  }
}
