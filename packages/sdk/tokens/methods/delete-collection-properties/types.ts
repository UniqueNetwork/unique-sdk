import { Address, TxBuildArguments } from '@unique-nft/sdk/types';

export type DeleteCollectionPropertiesArguments = {
  address: Address;
  collectionId: number;
  propertyKeys: string[];
};

export type DeleteCollectionPropertiesBuildArguments = TxBuildArguments & {
  args: [number, string[]];
};

export type CollectionPropertyDeletedEvent = {
  collectionId: number;
  propertyKey: string;
};

export type DeleteCollectionPropertiesResult = CollectionPropertyDeletedEvent[];
