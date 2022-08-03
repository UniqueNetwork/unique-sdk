import { SchemaTools } from '@unique-nft/api';
import {
  CreateCollectionNewArguments,
  encodeCollectionBase,
} from '@unique-nft/sdk/tokens';
import { UpDataStructsCreateCollectionData } from '@unique-nft/unique-mainnet-types';
import { Registry } from '@polkadot/types/types';

export const encode = (
  registry: Registry,
  collection: CreateCollectionNewArguments,
): UpDataStructsCreateCollectionData => {
  const { schema } = collection;

  const properties = schema
    ? SchemaTools.encodeUnique.collectionSchema(schema)
    : undefined;

  const tokenPropertyPermissions = schema
    ? SchemaTools.encodeUnique.collectionTokenPropertyPermissions(schema)
    : undefined;

  return encodeCollectionBase(registry, collection, {
    properties,
    tokenPropertyPermissions,
  });
};
