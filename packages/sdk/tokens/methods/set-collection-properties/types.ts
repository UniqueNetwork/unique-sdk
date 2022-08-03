import { Address, TxBuildArguments } from '@unique-nft/sdk/types';
import { CollectionProperty } from '@unique-nft/sdk/tokens';

export type SetCollectionPropertiesArguments = {
  address: Address;
  collectionId: number;
  properties: CollectionProperty[];
};

export type SetCollectionPropertiesBuildArguments = TxBuildArguments & {
  args: [number, CollectionProperty[]];
};

export type CollectionPropertySetEvent = {
  collectionId: number;
  propertyKey: string;
};

export type SetCollectionPropertiesResult = CollectionPropertySetEvent[];
