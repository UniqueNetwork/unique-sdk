import {
  Address,
  TxBuildArguments,
} from '@unique-nft/sdk/types';

export interface ConfirmSponsorshipArguments {
  address: Address;
  collectionId: number;
}

export interface ConfirmSponsorshipBuildArguments extends TxBuildArguments {
  args: [number];
}

export interface ConfirmSponsorshipResult {
  collectionId: number;
  sponsor: string
}
