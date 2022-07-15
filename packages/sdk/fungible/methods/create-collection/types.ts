import { Address } from '@unique-nft/sdk/types';
import { CollectionInfoBase } from '@unique-nft/sdk/tokens';

export interface FungibleCollection extends CollectionInfoBase {
  decimals: number;
}

export interface CreateFungibleCollectionArguments extends FungibleCollection {
  address: Address;
}
