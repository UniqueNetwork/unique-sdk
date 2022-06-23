import '@unique-nft/unique-mainnet-types/augment-api';

import { Sdk } from '@unique-nft/sdk';
import { MutationMethodWrap, QueryMethod } from '@unique-nft/sdk/extrinsics';

import {
  UnsignedTxPayload,
  BurnCollectionArguments,
  TransferCollectionArguments,
} from '@unique-nft/sdk/types';
import { CreateCollectionExMutation } from './mutations/create-collection-ex/method';
import { CreateCollectionArguments } from './mutations/create-collection-ex/types';
import { collectionById } from './mutations/collection-by-id/method';
import {
  CollectionIdArguments,
  CollectionInfo,
} from './mutations/collection-by-id/types';

export class SdkCollections {
  constructor(readonly sdk: Sdk) {
    this.creation = new CreateCollectionExMutation(sdk);
    this.get = collectionById.bind(sdk);
  }

  creation: MutationMethodWrap<
    CreateCollectionArguments,
    CollectionIdArguments
  >;

  get: QueryMethod<CollectionIdArguments, CollectionInfo>;

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
