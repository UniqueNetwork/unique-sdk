import { Address } from '@unique-nft/sdk/types';

export type PropertyPermission = {
  mutable: boolean;
  collectionAdmin: boolean;
  tokenOwner: boolean;
};

export type PropertyKeyPermission = {
  key: string;
  permission: PropertyPermission;
};

export type SetTokenPropertyPermissionsArguments = {
  address: Address;
  collectionId: number;
  propertyPermissions: PropertyKeyPermission[];
};

export type PropertyPermissionSetEvent = {
  collectionId: number;
  property: string;
};

export type SetTokenPropertyPermissionsResult = PropertyPermissionSetEvent[];
