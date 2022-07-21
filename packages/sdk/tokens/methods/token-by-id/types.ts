import { DecodedAttributes } from '@unique-nft/api';

export interface TokenDecoded {
  tokenId: number;
  collectionId: number;
  owner: { Substrate: string } | { Ethereum: string };
  attributes: DecodedAttributes;
}
