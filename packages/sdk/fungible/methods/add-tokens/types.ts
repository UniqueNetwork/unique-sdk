import { Address } from '@unique-nft/sdk/types';

export interface AddTokensArgs {
  address: Address;
  collectionId: number;
  recipient?: Address;
  amount: number;
}

export interface AddTokensResult {
  collectionId: number;
  recipient: Address;
  amount: number;
}
