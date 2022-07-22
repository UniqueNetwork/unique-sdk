import { Address } from '@unique-nft/sdk/types';
import { PropertyKeyPermission } from '@unique-nft/sdk/tokens/types';

export type SetTokenPropertyPermissionsArguments = {
  address: Address;
  collectionId: number;
  propertyPermissions: PropertyKeyPermission[];
};

export type PropertyPermissionSetEvent = {
  collectionId: number;
  propertyKey: string;
};

export type SetTokenPropertyPermissionsResult = PropertyPermissionSetEvent[];
