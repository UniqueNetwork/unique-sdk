import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { SchemaTools } from '@unique-nft/api';
import { bytesToString } from '@unique-nft/sdk/utils';

import { CollectionIdArguments } from '../collection-by-id/types';
import { CollectionInfoWithSchema } from './types';
import { decodeCollectionBase } from '../../utils/decode-collection';
import { AttributesTransformer } from '../create-collection-ex-new/utils';

async function collectionByIdNewFn(
  this: Sdk,
  { collectionId }: CollectionIdArguments,
): Promise<CollectionInfoWithSchema | null> {
  const collectionOption = await this.api.rpc.unique.collectionById(
    collectionId,
  );

  const collection = collectionOption.unwrapOr(null);

  if (!collection) return null;

  const properties = collection.properties.map(({ key, value }) => ({
    key: bytesToString(key),
    value: bytesToString(value),
  }));

  const decodingResult = await SchemaTools.decode.collectionSchema(
    collectionId,
    properties,
  );

  const schema = decodingResult.isValid
    ? AttributesTransformer.toHuman(decodingResult.decoded)
    : undefined;

  return {
    ...decodeCollectionBase(collection),
    id: collectionId,
    owner: collection.owner.toString(),
    schema,
  };
}

export const collectionByIdNew: QueryMethod<
  CollectionIdArguments,
  CollectionInfoWithSchema
> = collectionByIdNewFn;
