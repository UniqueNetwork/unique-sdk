import { Address } from '@unique-nft/sdk/types';

export type DeleteTokenPropertiesArguments = {
  address: Address;
  collectionId: number;
  tokenId: number;
  propertyKeys: string[];
};

export type TokenPropertyDeletedEvent = {
  collectionId: number;
  tokenId: number;
  property: string;
};

export type DeleteTokenPropertiesResult = TokenPropertyDeletedEvent[];
