import { CollectionProperty } from '@unique-nft/sdk/tokens/types';

export type CollectionPropertiesArguments = {
  collectionId: number;
  propertyKeys?: string[];
};

export type CollectionPropertiesResult = CollectionProperty[];
