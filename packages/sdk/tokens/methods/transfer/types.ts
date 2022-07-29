import { Address, CrossAccountId } from '@unique-nft/sdk/types';

export interface TransferArguments {
  from: Address;
  to: Address;
  collectionId: number;
  tokenId: number;
}

export interface TransferResult {
  collectionId: number;
  tokenId: number;
  from: CrossAccountId;
  to: CrossAccountId;
}
