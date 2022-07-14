import { UniqueCollectionSchemaDecoded } from '../create-collection-ex-new/types';
import { CollectionInfoBase } from '../create-collection-ex/types';

export interface CollectionInfoWithSchema extends CollectionInfoBase {
  id: number;
  owner: string;
  schema: UniqueCollectionSchemaDecoded;
}
