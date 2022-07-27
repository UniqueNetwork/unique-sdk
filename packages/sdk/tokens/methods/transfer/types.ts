import {
  Address,
  CrossAccountId,
  TxBuildArguments,
} from '@unique-nft/sdk/types';

export interface TransferArguments {
  from: Address;
  to: Address;
  collectionId: number;
  tokenId: number;
}

export interface TransferBuildArguments extends TxBuildArguments {
  args: [CrossAccountId, number, number, 1];
}

export interface TransferResult {
  collectionId: number;
  tokenId: number;
  from: CrossAccountId;
  to: CrossAccountId;
}
