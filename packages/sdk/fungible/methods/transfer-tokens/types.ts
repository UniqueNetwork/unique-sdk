import {
  Address,
  CrossAccountId,
  TxBuildArguments,
} from '@unique-nft/sdk/types';

export interface TransferTokensArguments {
  address: Address;
  collectionId: number;
  recipient: Address;
  amount: number;
}

export interface TransferTokensBuildArguments extends TxBuildArguments {
  args: [CrossAccountId, number, number, bigint];
}

export interface TransferTokensResult {
  sender: Address;
  collectionId: number;
  recipient: Address;
  amount: number;
}
