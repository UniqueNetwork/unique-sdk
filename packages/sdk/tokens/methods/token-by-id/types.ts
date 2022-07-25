import { DecodedAttributes, UniqueTokenDecoded } from '@unique-nft/api';
import { TokenParentResult } from '../token-parent';

// todo - replace with Address
export type OwnerAddress = { Substrate: string } | { Ethereum: string };

export interface TokenDecoded
  extends Omit<UniqueTokenDecoded, 'tokenId' | 'collectionId' | 'owner'> {
  tokenId: number;
  collectionId: number;
  owner: OwnerAddress;
  parent?: TokenParentResult;
  attributes: DecodedAttributes;
}
