import { CollectionInfoBase } from '../create-collection-ex/types';

export interface CollectionIdArguments {
  collectionId: number;
}

export interface CollectionInfo extends CollectionInfoBase {
  id: number;
  owner: string;
  // todo tokensCount: number
}
