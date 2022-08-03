import { Address, TxBuildArguments } from '@unique-nft/sdk/types';

export interface BurnItemArguments {
  address: Address;
  collectionId: number;
  tokenId: number;
  value: number;
}

export interface BurnItemBuildArguments extends TxBuildArguments {
  args: [number, number, number];
}

export interface BurnItemResult {
  collectionId: number;
  tokenId: number;
  address: Address;
  value: number;
}