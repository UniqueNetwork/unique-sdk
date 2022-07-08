import { CollectionInfoBase } from '@unique-nft/sdk/tokens';
import { UniqueCollectionSchemaDecoded } from '@unique-nft/api';

export interface CollectionInfoWithSchema extends CollectionInfoBase {
  id: number;
  owner: string;
  schema: UniqueCollectionSchemaDecoded;
}
