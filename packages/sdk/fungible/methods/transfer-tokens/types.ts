import { Address } from '@unique-nft/sdk/types';

export interface TransferTokensArgs {
  address: Address;
  collectionId: number;
  recipient: Address;
  amount: number;
}

export interface TransferTokensResult {
  sender: Address;
  collectionId: number;
  recipient: Address;
  amount: number;
}
