import { Sdk } from '@unique-nft/sdk';
import { CollectionInfo, SdkReadableMethod } from '@unique-nft/sdk/types';
import { decodeCollection } from '../../utils';
import { CollectionIdArguments } from './types';

export const collectionById: SdkReadableMethod<
  CollectionIdArguments,
  CollectionInfo
> = async function (this: Sdk, { collectionId }) {
  const collectionOption = await this.api.rpc.unique.collectionById(
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
};
