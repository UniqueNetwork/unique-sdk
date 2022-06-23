import '@unique-nft/unique-mainnet-types/augment-api';

import { Sdk } from '@unique-nft/sdk';
import { MutationMethodWrap, QueryMethod } from '@unique-nft/sdk/extrinsics';

import {
  UnsignedTxPayload,
  BurnCollectionArguments,
  TransferCollectionArguments,
} from '@unique-nft/sdk/types';
import { CreateCollectionExMutation } from './methods/create-collection-ex/method';
import { CreateCollectionArguments } from './methods/create-collection-ex/types';
import { collectionById } from './methods/collection-by-id/method';
import {
  CollectionIdArguments,
  CollectionInfo,
} from './methods/collection-by-id/types';

export class SdkCollections {
  get: QueryMethod<CollectionIdArguments, CollectionInfo> = collectionById.bind(
    this.sdk,
  );

  constructor(readonly sdk: Sdk) {
    this.creation = new CreateCollectionExMutation(sdk);
  }

  creation: MutationMethodWrap<
    CreateCollectionArguments,
    CollectionIdArguments
  >;

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
