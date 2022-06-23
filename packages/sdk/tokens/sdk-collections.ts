import '@unique-nft/unique-mainnet-types/augment-api';

import { Sdk } from '@unique-nft/sdk';
import { MutationMethodWrap } from '@unique-nft/sdk/extrinsics';

import {
  UnsignedTxPayload,
  BurnCollectionArguments,
  CollectionIdArguments,
  CollectionInfo,
  CreateCollectionArguments,
  TransferCollectionArguments,
} from '@unique-nft/sdk/types';
import { decodeCollection } from './utils/decode-collection';
import { CreateCollectionExMutation } from './mutations/create-collection-ex';

export class SdkCollections {

  creation: MutationMethodWrap<
    CreateCollectionArguments,
    CollectionIdArguments
  > = new CreateCollectionExMutation(this.sdk);

  create = this.creation.submitWaitResult;

  constructor(
    readonly sdk: Sdk,
  ) {
  }

  async get({
    collectionId,
  }: CollectionIdArguments): Promise<CollectionInfo | null> {
    const collectionOption = await this.sdk.api.rpc.unique.collectionById(
      collectionId,
    );

    const collection = collectionOption.unwrapOr(null);
    if (!collection) return null;

    const decoded = decodeCollection(collection);

    return {
      ...decoded,
      id: collectionId,
      owner: collection.owner.toString(),
    };
  }

  transfer(args: TransferCollectionArguments): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build({
      address: args.from,
      section: 'unique',
      method: 'changeCollectionOwner',
      args: [args.collectionId, args.to],
    });
  }

  burn(args: BurnCollectionArguments): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build({
      address: args.address,
      section: 'unique',
      method: 'destroyCollection',
      args: [args.collectionId],
    });
  }
}
