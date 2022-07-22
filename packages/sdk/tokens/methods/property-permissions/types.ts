import { PropertyKeyPermission } from '@unique-nft/sdk/tokens/types';

export type PropertyPermissionsArguments = {
  collectionId: number;
  propertyKeys?: string[];
};

export type PropertyPermissionsResult = PropertyKeyPermission[];
