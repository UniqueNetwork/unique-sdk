import {
  Address,
  CrossAccountId,
  TxBuildArguments,
} from '@unique-nft/sdk/types';

export interface AddTokensArguments {
  address: Address;
  collectionId: number;
  recipient?: Address;
  amount: number;
}

export interface AddTokenBuildArguments extends TxBuildArguments {
  args: [number, CrossAccountId, { fungible: { value: number } }];
}

export interface AddTokensResult {
  collectionId: number;
  recipient: Address;
  amount: number;
}
