import { ApiPromise } from '@polkadot/api';
import type {
  BurnCollectionArgs,
  CreateCollectionArgs,
  ISdkCollection,
  ISdkExtrinsics,
  TransferCollectionArgs,
  UnsignedTxPayload,
} from '../types';
import { encodeCollection } from '../utils/collection-transformers';

export class SdkCollection implements ISdkCollection {
  constructor(readonly api: ApiPromise, readonly extrinsics: ISdkExtrinsics) {}

  create(collection: CreateCollectionArgs): Promise<UnsignedTxPayload> {
    const { address, ...rest } = collection;

    const encodedCollection = encodeCollection(this.api.registry, rest).toHex();

    return this.extrinsics.build({
      address,
      section: 'unique',
      method: 'createCollectionEx',
      args: [encodedCollection],
    });
  }

  transfer(args: TransferCollectionArgs): Promise<UnsignedTxPayload> {
    return this.extrinsics.build({
      address: args.from,
      section: 'unique',
      method: 'changeCollectionOwner',
      args: [args.collectionId, args.to],
    });
  }

  burn(args: BurnCollectionArgs): Promise<UnsignedTxPayload> {
    return this.extrinsics.build({
      address: args.address,
      section: 'unique',
      method: 'destroyCollection',
      args: [args.collectionId],
    });
  }
}
