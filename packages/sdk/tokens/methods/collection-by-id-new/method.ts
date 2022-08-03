import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { SchemaTools } from '@unique-nft/api';

import { CollectionIdArguments } from '../../types/shared';
import { CollectionInfoWithSchema } from './types';
import {
  decodeCollectionBase,
  decodeCollectionProperties,
} from '../../utils/decode-collection';

async function collectionByIdNewFn(
  this: Sdk,
  { collectionId }: CollectionIdArguments,
): Promise<CollectionInfoWithSchema | null> {
  const collectionOption = await this.api.rpc.unique.collectionById(
    collectionId,
  );

  const collection = collectionOption.unwrapOr(null);
  if (!collection) return null;

  const properties = decodeCollectionProperties(collection.properties);
  const decodingResult = await SchemaTools.decode.collectionSchema(
    collectionId,
    properties,
  );

  return {
    ...decodeCollectionBase(collection),
    id: collectionId,
    owner: collection.owner.toString(),
    properties,
    schema: decodingResult.result ?? undefined,
  };
}

export const collectionByIdNew: QueryMethod<
  CollectionIdArguments,
  CollectionInfoWithSchema
> = collectionByIdNewFn;
