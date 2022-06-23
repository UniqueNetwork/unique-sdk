import { CollectionInfoBase } from '../create-collection-ex/types';

export interface CollectionIdArguments {
  collectionId: number;
}

export interface TokenIdArguments extends CollectionIdArguments {
  tokenId: number;
}

export interface BurnTokenArguments extends TokenIdArguments {
  address: string;
}
export interface TransferTokenArguments extends TokenIdArguments {
  from: string;
  to: string;
}

export interface CollectionInfo extends CollectionInfoBase {
  id: number;
  owner: string;
  // todo tokensCount: number
}
