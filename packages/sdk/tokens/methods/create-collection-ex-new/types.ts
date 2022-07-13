import { Address } from '@unique-nft/sdk/types';
import { UniqueCollectionSchemaToCreate } from '@unique-nft/api';
import { CollectionInfoBase } from '../create-collection-ex/types';

export {
  AttributeType,
  AttributeKind,
  COLLECTION_SCHEMA_NAME as CollectionSchemaName,
  CollectionAttributesSchema,
  InfixOrUrlOrCidAndHash,
  UniqueTokenDecoded,
  AttributeSchema,
  CollectionId,
  UrlTemplateString,
  DecodedInfixOrUrlOrCidAndHash,
  TokenId,
  SubOrEthAddressObj,
  DecodedAttributes,
  LocalizedStringDictionary,
  UniqueTokenToCreate,
  EncodedTokenAttributes,
  UniqueCollectionSchemaDecoded,
} from '@unique-nft/api';

export { UniqueCollectionSchemaToCreate } from '@unique-nft/api';

export interface CreateCollectionNewArguments extends CollectionInfoBase {
  address: Address;
  schema: UniqueCollectionSchemaToCreate;
}
