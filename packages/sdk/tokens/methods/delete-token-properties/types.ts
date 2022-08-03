import { Address, TxBuildArguments } from '@unique-nft/sdk/types';

export type DeleteTokenPropertiesArguments = {
  address: Address;
  collectionId: number;
  tokenId: number;
  propertyKeys: string[];
};

export type DeleteTokenPropertiesBuildArguments = TxBuildArguments & {
  args: [number, number, string[]];
};

export type TokenPropertyDeletedEvent = {
  collectionId: number;
  tokenId: number;
  propertyKey: string;
};

export type DeleteTokenPropertiesResult = TokenPropertyDeletedEvent[];
