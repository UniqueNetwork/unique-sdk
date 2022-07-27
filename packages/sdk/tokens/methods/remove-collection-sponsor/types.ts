import {
  Address,
  TxBuildArguments,
} from '@unique-nft/sdk/types';

export interface RemoveCollectionSponsorArguments {
  address: Address;
  collectionId: number;
}

export interface RemoveCollectionSponsorBuildArguments extends TxBuildArguments {
  args: [number];
}

export interface RemoveCollectionSponsorResult {
  collectionId: number;
}
