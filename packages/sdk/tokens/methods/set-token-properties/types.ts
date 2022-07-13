import { Address } from '@unique-nft/sdk/types';

export type TokenProperty = {
  key: string;
  value: string;
};

export type SetTokenPropertiesArguments = {
  address: Address;
  collectionId: number;
  tokenId: number;
  properties: TokenProperty[];
};

export type TokenPropertySetEvent = {
  collectionId: number;
  tokenId: number;
  property: string;
};

export type SetTokenPropertiesResult = TokenPropertySetEvent[];
