import { UniqueCollectionSchemaDecoded } from '@unique-nft/api';
import { CollectionInfoBase } from '../create-collection-ex/types';
import { CollectionProperty } from '../../types/shared';

export { UniqueCollectionSchemaDecoded } from '@unique-nft/api';

export interface CollectionInfoWithSchema extends CollectionInfoBase {
  id: number;
  owner: string;
  schema?: UniqueCollectionSchemaDecoded;
  properties: CollectionProperty[];
}
