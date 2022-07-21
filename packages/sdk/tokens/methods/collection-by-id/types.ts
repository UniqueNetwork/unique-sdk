import { CollectionInfoWithOldProperties } from '../create-collection-ex/types';

export interface CollectionIdArguments {
  collectionId: number;
}

export interface CollectionInfo extends CollectionInfoWithOldProperties {
  id: number;
  owner: string;
  // todo tokensCount: number
}
