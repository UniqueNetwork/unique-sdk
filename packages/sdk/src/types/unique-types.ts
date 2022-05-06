import { AnyJson } from '@polkadot/types/types';
import { INamespace } from 'protobufjs';

export enum CollectionMode {
  Nft = 'Nft',
  Fungible = 'Fungible',
  ReFungible = 'ReFungible',
}

export enum CollectionAccess {
  Normal = 'Normal',
  AllowList = 'AllowList',
}

export enum CollectionSchemaVersion {
  ImageURL = 'ImageURL',
  Unique = 'Unique',
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
  accountTokenOwnershipLimit: number | null;
  sponsoredDataSize: number | null;
  sponsoredDataRateLimit: number | null;
  tokenLimit: number | null;
  sponsorTransferTimeout: number | null;
  sponsorApproveTimeout: number | null;
  ownerCanTransfer: boolean | null;
  ownerCanDestroy: boolean | null;
  transfersEnabled: boolean | null;
}

export interface CollectionInfo {
  id: number;
  owner: string;
  mode: CollectionMode | `${CollectionMode}`;
  access: CollectionAccess | `${CollectionAccess}`;
  schemaVersion: CollectionSchemaVersion | `${CollectionSchemaVersion}`;
  name: string;
  description: string;
  tokenPrefix: string;
  mintMode: boolean;
  offchainSchema: string;
  sponsorship: CollectionSponsorship | null;
  limits: CollectionLimits;
  constOnChainSchema: INamespace | null;
  variableOnChainSchema: AnyJson | null;
  metaUpdatePermission: MetaUpdatePermission | `${MetaUpdatePermission}`;
}

export interface TokenInfo {
  id: number;
  collectionId: number;
  url: string | null;
  constData: Record<string, any> | null;
  variableData: string | null;
  owner: string;
}
