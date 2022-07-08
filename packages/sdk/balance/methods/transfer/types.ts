import { Address } from '@unique-nft/sdk/types';

export interface BalanceTransferArguments {
  address: Address;
  destination: string;
  amount: number;
}

export interface BalanceTransferResult {
  success: boolean;
}
