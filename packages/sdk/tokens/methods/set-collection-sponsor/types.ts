import {
  Address,
} from '@unique-nft/sdk/types';

export interface SetCollectionSponsorArguments {
  address: Address;
  collectionId: number;
  newSponsor: Address;
}

export interface SetCollectionSponsorResult {
  collectionId: number;
  sponsor: string
}
