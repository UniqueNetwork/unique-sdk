import { Address, TxBuildArguments } from '@unique-nft/sdk/types';

export interface BalanceTransferArguments {
  address: Address;
  destination: Address;
  amount: number;
}

export interface BalanceTransferBuildArguments extends TxBuildArguments {
  args: [Address, bigint];
}

export interface BalanceTransferResult {
  success: boolean;
}
