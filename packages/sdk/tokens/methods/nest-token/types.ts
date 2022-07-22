import {
  Address,
  TxBuildArguments,
  CrossAccountId,
} from '@unique-nft/sdk/types';
import { TokenIdArguments } from '@unique-nft/sdk/tokens';

export type NestTokenArguments = {
  parent: TokenIdArguments;
  nested: TokenIdArguments;
  address: Address;
};

export type NestTokenBuildArguments = TxBuildArguments & {
  args: [CrossAccountId, CrossAccountId, number, number, number];
};

export type NestTokenResult = {
  collectionId: number;
  tokenId: number;
};
