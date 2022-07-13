import { Address } from '@unique-nft/sdk/types';

export type CollectionProperty = {
  key: string;
  value: string;
};

export type SetCollectionPropertiesArguments = {
  address: Address;
  collectionId: number;
  properties: CollectionProperty[];
};

export type CollectionPropertySetEvent = {
  collectionId: number;
  property: string;
};

export type SetCollectionPropertiesResult = CollectionPropertySetEvent[];
