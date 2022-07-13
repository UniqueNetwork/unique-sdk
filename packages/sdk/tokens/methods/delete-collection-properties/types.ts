import { Address } from '@unique-nft/sdk/types';

export type DeleteCollectionPropertiesArguments = {
  address: Address;
  collectionId: number;
  propertyKeys: string[];
};

export type CollectionPropertyDeletedEvent = {
  collectionId: number;
  property: string;
};

export type DeleteCollectionPropertiesResult = CollectionPropertyDeletedEvent[];
