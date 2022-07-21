import { UniqueCollectionSchemaDecoded } from '../create-collection-ex-new/types';
import { CollectionInfoBase } from '../create-collection-ex/types';
import { CollectionProperty } from '../../types/shared';

export interface CollectionInfoWithSchema extends CollectionInfoBase {
  id: number;
  owner: string;
  schema?: UniqueCollectionSchemaDecoded;
  properties: CollectionProperty[];
}
