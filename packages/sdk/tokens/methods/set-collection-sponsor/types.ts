import {
  Address,
  TxBuildArguments,
} from '@unique-nft/sdk/types';

export interface SetCollectionSponsorArguments {
  address: Address;
  collectionId: number;
  newSponsor: Address;
}

export interface SetCollectionSponsorBuildArguments extends TxBuildArguments {
  args: [number, string];
}

export interface SetCollectionSponsorResult {
  collectionId: number;
  sponsor: string
}
