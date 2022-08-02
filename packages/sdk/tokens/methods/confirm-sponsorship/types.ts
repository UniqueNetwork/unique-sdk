import {
  Address,
} from '@unique-nft/sdk/types';

export interface ConfirmSponsorshipArguments {
  address: Address;
  collectionId: number;
}

export interface ConfirmSponsorshipResult {
  collectionId: number;
  sponsor: string
}
