import {
  Address,
  CrossAccountId,
  TxBuildArguments,
} from '@unique-nft/sdk/types';

export interface ApproveArguments {
  spender: Address;
  collectionId: number;
  tokenId: number;
  isApprove: boolean;
}

export interface ApproveBuildArguments extends TxBuildArguments {
  args: [CrossAccountId, number, number, number];
}

export interface ApproveResult {
  collectionId: number;
  tokenId: number;
}
