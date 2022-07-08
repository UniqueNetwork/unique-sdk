import { Address } from '@unique-nft/sdk/types';
import { CollectionInfoBase } from '@unique-nft/sdk/tokens';
import { UniqueCollectionSchemaDecoded } from '@unique-nft/api';

export interface CreateCollectionNewArguments extends CollectionInfoBase {
  address: Address;
  schema: UniqueCollectionSchemaDecoded;
}
