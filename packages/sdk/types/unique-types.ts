import { INamespace } from 'protobufjs';
import { CollectionFields } from './unique-fields';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

export enum CollectionAccess {
  Normal = 'Normal',
  AllowList = 'AllowList',
}

export enum CollectionNesting {
  Disabled = 'Disabled',
  Owner = 'Owner',
  OwnerRestricted = 'OwnerRestricted',
}

export enum CollectionSchemaVersion {
  ImageURL = 'ImageURL',
  Unique = 'Unique',
}

export interface CollectionPermissions {
  access?: CollectionAccess | `${CollectionAccess}`;
  mintMode?: boolean;
  nesting?: CollectionNesting | `${CollectionNesting}`;
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

export enum TokenPropertiesKeys {
  constData = '_old_constData',
}

export interface TokenPropertiesPermissions {
  constData?: TokenPropertyPermissions;
}

export interface TokenPropertyPermissions {
  mutable?: boolean;
  collectionAdmin?: boolean;
  tokenOwner?: boolean;
}

export interface TokenProperties {
  constData?: AnyObject;
}

export interface TokenInfo {
  id: number;
  collectionId: number;
  url: string | null;
  owner: string | null;
  properties: TokenProperties;
}

export type TokenPayload =
  | {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      NFT: any;
    }
  | {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      Fungible: any;
    }
  | {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      ReFungible: any;
    };
