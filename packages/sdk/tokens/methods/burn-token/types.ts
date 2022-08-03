import {
  Address,
  CrossAccountId,
  TxBuildArguments,
} from '@unique-nft/sdk/types';

export interface BurnTokenArguments {
  address: Address;
  collectionId: number;
  from?: Address;
  tokenId: number;
  value?: number;
}

export interface BurnTokenBuildArguments extends TxBuildArguments {
  args:
    | [number, CrossAccountId, number, number]
    | [number, number, number]
    | [number, CrossAccountId, number]
    | [number, number];
}

export interface BurnTokenResult {
  collectionId: number;
  tokenId: number;
  address: Address;
  value: number;
}
