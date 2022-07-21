import { Address } from '@unique-nft/sdk/types';
import {
  AttributeKind,
  AttributeType,
  AttributeSchema as AttributeSchemaOriginal,
  UniqueCollectionSchemaToCreate as UniqueCollectionSchemaToCreateOriginal,
  UniqueCollectionSchemaDecoded as UniqueCollectionSchemaDecodedOriginal,
} from '@unique-nft/api';
import { CollectionInfoBase } from '../create-collection-ex/types';

export {
  AttributeType,
  AttributeKind,
  COLLECTION_SCHEMA_NAME as CollectionSchemaName,
} from '@unique-nft/api';

export type {
  InfixOrUrlOrCidAndHash,
  UniqueTokenDecoded,
  CollectionId,
  UrlTemplateString,
  DecodedInfixOrUrlOrCidAndHash,
  TokenId,
  SubOrEthAddressObj,
  DecodedAttributes,
  LocalizedStringDictionary,
  UniqueTokenToCreate,
  EncodedTokenAttributes,
} from '@unique-nft/api';

export type AttributeTypeName = keyof typeof AttributeType;
export type AttributeKindName = keyof typeof AttributeKind;

export type AttributeSchema = Omit<AttributeSchemaOriginal, 'kind' | 'type'> & {
  kind: AttributeKindName;
  type: AttributeTypeName;
};

export type CollectionAttributesSchema = Record<number, AttributeSchema>;

export type UniqueCollectionSchemaToCreate = Omit<
  UniqueCollectionSchemaToCreateOriginal,
  'attributesSchema'
> & {
  attributesSchema: CollectionAttributesSchema;
};

export type UniqueCollectionSchemaDecoded = Omit<
  UniqueCollectionSchemaDecodedOriginal,
  'attributesSchema'
> & {
  attributesSchema: CollectionAttributesSchema;
};

export interface CreateCollectionNewArguments extends CollectionInfoBase {
  address: Address;
  schema?: UniqueCollectionSchemaToCreate;
}
