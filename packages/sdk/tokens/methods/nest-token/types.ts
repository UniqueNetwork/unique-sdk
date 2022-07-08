import { Address } from '@unique-nft/sdk/types';

export type NestTokenParentArguments = {
  collectionId: number;
  tokenId: number;
};

export type NestTokenNestedArguments = {
  collectionId: number;
  tokenId: number;
};

export type NestTokenArguments = {
  parent: NestTokenParentArguments;
  nested: NestTokenNestedArguments;
  address: Address;
};

export type NestTokenResult = {
  collectionId: number;
  tokenId: number;
};
