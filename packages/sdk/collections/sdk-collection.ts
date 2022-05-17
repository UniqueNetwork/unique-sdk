import { ApiPromise } from '@polkadot/api';
import { SdkExtrinsics, UnsignedTxPayload } from '@unique-nft/sdk/extrinsics';
import { validate } from '@unique-nft/sdk/validation';
import {
  BurnCollectionArgs,
  CreateCollectionArgs,
  ISdkCollection,
  TransferCollectionArgs,
} from '@unique-nft/sdk/types';

import { encodeCollection } from './utils/encode-collection';

interface Sdk {
  api: ApiPromise;
  extrinsics: SdkExtrinsics;
}

export class SdkCollection implements ISdkCollection {
  constructor(readonly sdk: Sdk) {}

  async create(collection: CreateCollectionArgs): Promise<UnsignedTxPayload> {
    await validate(collection, CreateCollectionArgs);
    const { address, ...rest } = collection;

    const encodedCollection = encodeCollection(
      this.sdk.api.registry,
      rest,
    ).toHex();

    return this.sdk.extrinsics.build({
      address,
      section: 'unique',
      method: 'createCollectionEx',
      args: [encodedCollection],
    });
  }

  transfer(args: TransferCollectionArgs): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build({
      address: args.from,
      section: 'unique',
      method: 'changeCollectionOwner',
      args: [args.collectionId, args.to],
    });
  }

  burn(args: BurnCollectionArgs): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build({
      address: args.address,
      section: 'unique',
      method: 'destroyCollection',
      args: [args.collectionId],
    });
  }
}
