import { Address } from '@unique-nft/sdk/types';
import { UniqueCollectionSchemaToCreate } from '@unique-nft/api';
import { CollectionInfoBase } from '../create-collection-ex/types';

export interface CreateCollectionNewArguments extends CollectionInfoBase {
  address: Address;
  schema?: UniqueCollectionSchemaToCreate;
}

export type {
  AttributeSchema,
  CollectionAttributesSchema,
  UrlTemplateString,
  BoxedNumberWithDefault,
  LocalizedStringWithDefault,
  UniqueCollectionSchemaToCreate,
  InfixOrUrlOrCidAndHash,
} from '@unique-nft/api';

export { COLLECTION_SCHEMA_NAME, AttributeType } from '@unique-nft/api';
