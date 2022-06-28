import { INamespace } from 'protobufjs';
import {
  CollectionFields,
  CollectionSchemaVersion,
  TokenPropertyPermissions,
} from '@unique-nft/sdk/types';

import { CollectionLimits } from '../set-collection-limits/types';

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

export enum CollectionAccess {
  Normal = 'Normal',
  AllowList = 'AllowList',
}

export interface CollectionNestingPermissions {
  tokenOwner: boolean;
  collectionAdmin: boolean;
  permissive: boolean;
}

export interface CollectionPermissions {
  access?: CollectionAccess | `${CollectionAccess}`;
  mintMode?: boolean;
  nesting?: CollectionNestingPermissions;
}

export interface CollectionProperties {
  offchainSchema?: string;
  schemaVersion?: CollectionSchemaVersion | `${CollectionSchemaVersion}`;
  variableOnChainSchema?: string | null;
  constOnChainSchema?: INamespace | null;
  fields?: CollectionFields;
}

export enum CollectionPropertiesKeys {
  offchainSchema = '_old_offchainSchema',
  schemaVersion = '_old_schemaVersion',
  variableOnChainSchema = '_old_variableOnChainSchema',
  constOnChainSchema = '_old_constOnChainSchema',
}

export interface CollectionSponsorship {
  address: string;
  isConfirmed: boolean;
}

export interface TokenPropertiesPermissions {
  constData?: TokenPropertyPermissions;
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
