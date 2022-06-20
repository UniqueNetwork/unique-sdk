import '@unique-nft/types/augment-api';
import '@unique-nft/sdk/extrinsics';
import {
  UnsignedTxPayload,
  BurnCollectionArguments,
  TransferCollectionArguments,
  SdkMutationMethod,
  CreateCollectionArguments,
  CollectionInfo,
} from '@unique-nft/sdk/types';

import { Sdk } from '@unique-nft/sdk';
import { collectionById } from './methods/collection-by-id/method';
import { CreateCollectionExMutation } from './methods/create-collection-ex/method';

export class SdkCollections {
  constructor(readonly sdk: Sdk) {
    this.create = new CreateCollectionExMutation(this.sdk).getMethod();
  }

  get = collectionById.bind(this.sdk);

  create: SdkMutationMethod<CreateCollectionArguments, CollectionInfo>;

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
