import {
  UniqueCollectionSchemaToCreate,
  COLLECTION_SCHEMA_NAME,
  SchemaTools,
} from '@unique-nft/api';
import {
  CreateCollectionNewArguments,
  encodeCollectionBase,
} from '@unique-nft/sdk/tokens';
import { UpDataStructsCreateCollectionData } from '@unique-nft/unique-mainnet-types/default/index';
import { Registry } from '@polkadot/types/types';

export const defaultSchema: UniqueCollectionSchemaToCreate = {
  attributesSchema: {},
  attributesSchemaVersion: '',
  coverPicture: {
    ipfsCid: '',
  },
  image: { urlTemplate: '{infix}' },
  schemaName: COLLECTION_SCHEMA_NAME.unique,
  schemaVersion: '1.0.0',
};

export const encode = (
  registry: Registry,
  collection: CreateCollectionNewArguments,
): UpDataStructsCreateCollectionData => {
  const { schema } = collection;

  const properties = schema
    ? SchemaTools.encodeUnique.collectionSchema({ ...schema, ...defaultSchema })
    : undefined;

  const tokenPropertyPermissions = schema
    ? SchemaTools.encodeUnique.collectionTokenPropertyPermissions({
        ...schema,
        ...defaultSchema,
      })
    : undefined;

  return encodeCollectionBase(registry, collection, {
    properties,
    tokenPropertyPermissions,
  });
};
