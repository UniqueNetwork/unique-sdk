import { TokenProperty } from '@unique-nft/sdk/tokens/types';

export type TokenPropertiesArguments = {
  collectionId: number;
  tokenId: number;
  propertyKeys?: string[];
};

export type TokenPropertiesResult = TokenProperty[];
