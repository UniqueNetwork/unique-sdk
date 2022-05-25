import '@unique-nft/types/augment-api';

import { ApiPromise } from '@polkadot/api';
import { SdkExtrinsics } from '@unique-nft/sdk/extrinsics';
import {
  UnsignedTxPayload,
  BurnCollectionArgs,
  CollectionIdArg,
  CollectionInfo,
  CreateCollectionArgs,
  ISdkCollection,
  TransferCollectionArgs,
} from '@unique-nft/sdk/types';

import { decodeCollection } from './utils/decode-collection';
import { encodeCollection } from './utils/encode-collection';

interface Sdk {
  api: ApiPromise;
  extrinsics: SdkExtrinsics;
}

export class SdkCollection implements ISdkCollection {
  constructor(readonly sdk: Sdk) {}

  async get({ collectionId }: CollectionIdArg): Promise<CollectionInfo | null> {
    const collectionOption = await this.sdk.api.rpc.unique.collectionById(
      collectionId,
    );

    const collection = collectionOption.unwrapOr(null);

    if (!collection) return null;

    const tokensCount = await this.sdk.api.rpc.unique.lastTokenId(collectionId);
    const decoded = decodeCollection(collection);

    return {
      ...decoded,
      id: collectionId,
      tokensCount: tokensCount.toNumber(),
      owner: collection.owner.toString(),
    };
  }

  async create(collection: CreateCollectionArgs): Promise<UnsignedTxPayload> {
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
