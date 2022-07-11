import { Address } from '@unique-nft/sdk/types';
import { CollectionInfoBase } from '@unique-nft/sdk/tokens';
import { UniqueCollectionSchemaToCreate } from '@unique-nft/api';

export interface CreateCollectionNewArguments extends CollectionInfoBase {
  address: Address;
  schema: UniqueCollectionSchemaToCreate;
}
