import { CollectionInfoBase } from '@unique-nft/sdk/tokens';

export interface FungibleCollection extends CollectionInfoBase {
  id: number;
  owner: string;
  decimals: number;
}
