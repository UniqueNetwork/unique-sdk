import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';

import { CollectionInfo } from './types';
import { decodeCollection } from '../../utils';
import { CollectionIdArguments } from '../../types/shared';

async function collectionByIdFn(
  this: Sdk,
  args: CollectionIdArguments,
): Promise<CollectionInfo | null> {
  const collectionOption = await this.api.rpc.unique.collectionById(
    args.collectionId,
  );

  const collection = collectionOption.unwrapOr(null);
  if (!collection) return null;

  const decoded = decodeCollection(collection);

  return {
    ...decoded,
    id: args.collectionId,
    owner: collection.owner.toString(),
  };
}

export const collectionById: QueryMethod<
  CollectionIdArguments,
  CollectionInfo
> = collectionByIdFn;
