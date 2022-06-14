import { CollectionInfoBase } from '@unique-nft/sdk/types';

export interface CollectionIdArguments {
  collectionId: number;
}

export interface CollectionInfo extends CollectionInfoBase {
  id: number;
  owner: string;
  // todo tokensCount: number
}
