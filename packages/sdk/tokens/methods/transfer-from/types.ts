import { Address, CrossAccountId } from '@unique-nft/sdk/types';

export interface TransferFromArguments {
  address: Address;
  from: Address;
  to: Address;
  collectionId: number;
  tokenId: number;
}

export interface TransferFromResult {
  collectionId: number;
  tokenId: number;
  from: CrossAccountId;
  to: CrossAccountId;
}
