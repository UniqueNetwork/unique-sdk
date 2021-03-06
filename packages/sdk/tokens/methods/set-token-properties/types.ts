import { Address, TxBuildArguments } from '@unique-nft/sdk/types';
import { TokenProperty } from '@unique-nft/sdk/tokens/types';

export type SetTokenPropertiesArguments = {
  address: Address;
  collectionId: number;
  tokenId: number;
  properties: TokenProperty[];
};

export type SetTokenPropertiesBuildArguments = TxBuildArguments & {
  args: [number, number, TokenProperty[]];
};

export type TokenPropertySetEvent = {
  collectionId: number;
  tokenId: number;
  propertyKey: string;
};

export type SetTokenPropertiesResult = TokenPropertySetEvent[];
