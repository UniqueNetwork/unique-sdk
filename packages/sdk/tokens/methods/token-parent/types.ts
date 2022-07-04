import { Address } from '@unique-nft/sdk/types';

export type TokenParentArguments = {
  collectionId: number;
  tokenId: number;
};

export type TokenParentResult = {
  collectionId: number;
  tokenId: number;
  address: Address;
};
