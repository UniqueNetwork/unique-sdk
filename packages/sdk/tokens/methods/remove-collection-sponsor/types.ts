import {
  Address,
} from '@unique-nft/sdk/types';

export interface RemoveCollectionSponsorArguments {
  address: Address;
  collectionId: number;
}

export interface RemoveCollectionSponsorResult {
  collectionId: number;
}
