import { Address } from '@unique-nft/sdk/types';
import { UniqueCollectionSchemaToCreate } from '@unique-nft/api';
import { CollectionInfoBase } from '../create-collection-ex/types';

export interface CreateCollectionNewArguments extends CollectionInfoBase {
  address: Address;
  schema?: UniqueCollectionSchemaToCreate;
}

export {
  AttributeSchema,
  CollectionAttributesSchema,
  AttributeType,
  UrlTemplateString,
  COLLECTION_SCHEMA_NAME,
  BoxedNumberWithDefault,
  LocalizedStringWithDefault,
  UniqueCollectionSchemaToCreate,
  InfixOrUrlOrCidAndHash,
} from '@unique-nft/api';
