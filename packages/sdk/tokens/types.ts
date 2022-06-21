import { AddressArguments, AnyObject } from '@unique-nft/sdk/types';

import { CollectionIdArguments } from './methods/collection-by-id/types';

export * from './methods/create-collection-ex/types';
export * from './methods/collection-by-id/types';

export interface BurnCollectionArguments {
  collectionId: number;
  address: string;
}

export interface TransferCollectionArguments {
  collectionId: number;
  from: string;
  to: string;
}

export interface CreateTokenArguments extends AddressArguments {
  // todo - rename "address" field to "author" or "creator" ?
  collectionId: number;
  owner?: string;
  constData: AnyObject;
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
