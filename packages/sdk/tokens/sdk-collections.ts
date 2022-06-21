import '@unique-nft/unique-mainnet-types/augment-api';

import { MutationMethodNg } from '@unique-nft/sdk/extrinsics';

import {
  UnsignedTxPayload,
  SdkMutationMethod,
  CollectionInfo,
  SdkReadableMethod,
} from '@unique-nft/sdk/types';
import { Sdk } from '@unique-nft/sdk';
import { collectionById } from './methods/collection-by-id/method';
import { CreateCollectionExMutation } from './methods/create-collection-ex/method';
import {
  BurnCollectionArguments,
  CreateCollectionArguments,
  TransferCollectionArguments,
  CollectionIdArguments,
} from './types';
import { CreateCollectionMutationNg } from './methods/create-collection-ex/method-ng';

export class SdkCollections {
  constructor(readonly sdk: Sdk) {
    this.create = new CreateCollectionExMutation(sdk).getMethod();
    this.createNg = new CreateCollectionMutationNg(sdk).expose();

    this.get = collectionById.bind(sdk);
  }

  get: SdkReadableMethod<CollectionIdArguments, CollectionInfo>;

  create: SdkMutationMethod<CreateCollectionArguments, CollectionIdArguments>;

  createNg: MutationMethodNg<CreateCollectionArguments, CollectionIdArguments>;

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
