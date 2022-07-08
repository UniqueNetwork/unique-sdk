import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { SchemaTools, UniqueCollectionSchemaDecoded } from '@unique-nft/api';
import { bytesToString } from '@unique-nft/sdk/utils';
import { SdkError } from '@unique-nft/sdk/errors';

import { CollectionIdArguments } from '../collection-by-id/types';

async function collectionByIdNewFn(
  this: Sdk,
  { collectionId }: CollectionIdArguments,
): Promise<UniqueCollectionSchemaDecoded | null> {
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

  if (!decodingResult.isValid)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    throw SdkError.wrapError(decodingResult.validationError);

  return decodingResult.decoded;
}

export const collectionByIdNew: QueryMethod<
  CollectionIdArguments,
  UniqueCollectionSchemaDecoded
> = collectionByIdNewFn;
