import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { bytesToString } from '@unique-nft/sdk/utils';
import { PropertyPermission } from '@unique-nft/sdk/tokens/types';
import {
  PropertyPermissionsArguments,
  PropertyPermissionsResult,
} from './types';

async function query(
  this: Sdk,
  args: PropertyPermissionsArguments,
): Promise<PropertyPermissionsResult> {
  const propertyPermissions = args.propertyKeys
    ? await this.api.rpc.unique.propertyPermissions(
        args.collectionId,
        args.propertyKeys,
      )
    : await this.api.rpc.unique.propertyPermissions(args.collectionId);

  return propertyPermissions.map(({ key, permission }) => ({
    key: bytesToString(key),
    permission: permission.toJSON() as PropertyPermission,
  }));
}

export const propertyPermissionsQuery: QueryMethod<
  PropertyPermissionsArguments,
  PropertyPermissionsResult
> = query;
