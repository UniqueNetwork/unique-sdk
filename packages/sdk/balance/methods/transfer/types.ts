import { Address } from '@unique-nft/sdk/types';

export interface TransferBuildArguments {
  address: Address;
  destination: string;
  amount: number;
}

export interface BalanceTransferResult {
  success: boolean;
}
