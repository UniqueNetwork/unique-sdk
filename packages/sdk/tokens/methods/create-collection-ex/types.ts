import {
  CollectionPermissions,
  CollectionProperties,
  TokenPropertiesPermissions,
} from '@unique-nft/sdk/types';

export enum CollectionMode {
  Nft = 'Nft',
  Fungible = 'Fungible',
  ReFungible = 'ReFungible',
}

export enum MetaUpdatePermission {
  ItemOwner = 'ItemOwner',
  Admin = 'Admin',
  None = 'None',
}

export interface CollectionSponsorship {
  address: string;
  isConfirmed: boolean;
}

export interface CollectionLimits {
  accountTokenOwnershipLimit?: number | null;
  sponsoredDataSize?: number | null;
  sponsoredDataRateLimit?: number | null;
  tokenLimit?: number | null;
  sponsorTransferTimeout?: number | null;
  sponsorApproveTimeout?: number | null;
  ownerCanTransfer?: boolean | null;
  ownerCanDestroy?: boolean | null;
  transfersEnabled?: boolean | null;
}

export interface CollectionInfoBase {
  mode?: CollectionMode | `${CollectionMode}`;
  name: string;
  description: string;
  tokenPrefix: string;
  sponsorship?: CollectionSponsorship | null;
  limits?: CollectionLimits;
  metaUpdatePermission?: MetaUpdatePermission | `${MetaUpdatePermission}`;

  properties: CollectionProperties;
  permissions?: CollectionPermissions;
  tokenPropertyPermissions?: TokenPropertiesPermissions;
}

export interface CreateCollectionArguments extends CollectionInfoBase {
  address: string;
}
