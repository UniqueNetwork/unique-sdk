import { UniqueCollectionSchemaDecoded } from '@unique-nft/api';
import { CollectionInfoBase } from '../create-collection-ex/types';

export interface CollectionInfoWithSchema extends CollectionInfoBase {
  id: number;
  owner: string;
  schema: UniqueCollectionSchemaDecoded;
}
