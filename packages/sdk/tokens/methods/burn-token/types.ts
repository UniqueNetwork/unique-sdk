import { Address, TxBuildArguments } from '@unique-nft/sdk/types';

export interface BurnTokenArguments {
  address: Address;
  collectionId: number;
  tokenId: number;
  value: number;
}

export interface BurnTokenBuildArguments extends TxBuildArguments {
  args: [number, number, number];
}

export interface BurnTokenResult {
  collectionId: number;
  tokenId: number;
  address: Address;
  value: number;
}
