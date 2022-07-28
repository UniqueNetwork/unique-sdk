export interface CollectionIdArguments {
  collectionId: number;
}

export interface TokenIdArguments extends CollectionIdArguments {
  tokenId: number;
}

export interface BurnTokenArguments extends TokenIdArguments {
  address: string;
}

export type CollectionProperty = {
  key: string;
  value: string;
};

export type TokenProperty = {
  key: string;
  value: string;
};

export type PropertyPermission = {
  mutable: boolean;
  collectionAdmin: boolean;
  tokenOwner: boolean;
};

export type PropertyKeyPermission = {
  key: string;
  permission: PropertyPermission;
};
