import { Address } from '@unique-nft/sdk/types';

export type TopmostTokenOwnerArguments = {
  collectionId: number;
  tokenId: number;
  blockHashAt?: string;
};

export type TopmostTokenOwnerResult = Address;
