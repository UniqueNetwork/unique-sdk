import {
  Address,
  CrossAccountId,
  TxBuildArguments,
} from '@unique-nft/sdk/types';

export type UnnestTokenParentArguments = {
  collectionId: number;
  tokenId: number;
};

export type UnnestTokenNestedArguments = {
  collectionId: number;
  tokenId: number;
};

export type UnnestTokenArguments = {
  parent: UnnestTokenParentArguments;
  nested: UnnestTokenNestedArguments;
  address: Address;
};

export type UnnestTokenBuildArguments = TxBuildArguments & {
  args: [CrossAccountId, CrossAccountId, number, number, number];
};

export type UnnestTokenResult = {
  collectionId: number;
  tokenId: number;
};
