import { CollectionIdArguments } from '../methods/collection-by-id/types';

export * from '../methods/create-collection-ex/types';
export * from '../methods/create-collection-ex-new/types';
export * from '../methods/collection-by-id/types';
export * from '../methods/collection-by-id-new/types';
export * from '../methods/create-token/types';
export * from '../methods/nest-token/types';
export * from '../methods/unnest-token/types';
export * from '../methods/token-children/types';
export * from '../methods/token-parent/types';
export * from '../methods/topmost-token-owner/types';
export * from '../methods/set-collection-limits/types';
export * from '../methods/get-stats/types';
export * from '../methods/set-collection-properties/types';
export * from '../methods/delete-collection-properties/types';
export * from '../methods/set-token-properties/types';
export * from '../methods/delete-token-properties/types';
export * from '../methods/set-token-property-permissions/types';
export * from '../methods/collection-properties/types';
export * from '../methods/token-properties/types';
export * from '../methods/property-permissions/types';

export interface TokenIdArguments extends CollectionIdArguments {
  tokenId: number;
}

export interface BurnTokenArguments extends TokenIdArguments {
  address: string;
}
export interface TransferTokenArguments extends TokenIdArguments {
  from: string;
  to: string;
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
