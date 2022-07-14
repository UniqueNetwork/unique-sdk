import { Address } from '@unique-nft/sdk/types';
import { CollectionProperty } from '@unique-nft/sdk/tokens/types';

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
