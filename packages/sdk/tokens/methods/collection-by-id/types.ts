import { CollectionInfoWithProperties } from '../create-collection-ex/types';

export interface CollectionIdArguments {
  collectionId: number;
}

export interface CollectionInfo extends CollectionInfoWithProperties {
  id: number;
  owner: string;
  // todo tokensCount: number
}
