import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@unique-nft/sdk/types';
import { u32, Bytes } from '@polkadot/types-codec';
import { bytesToString } from '@unique-nft/sdk/utils';
import {
  SetTokenPropertyPermissionsArguments,
  SetTokenPropertyPermissionsResult,
  SetTokenPropertyPermissionsBuildArguments,
} from './types';

/* eslint-disable class-methods-use-this */

export class SetTokenPropertyPermissionsMutation extends MutationMethodBase<
  SetTokenPropertyPermissionsArguments,
  SetTokenPropertyPermissionsResult
> {
  async transformArgs(
    args: SetTokenPropertyPermissionsArguments,
  ): Promise<SetTokenPropertyPermissionsBuildArguments> {
    const { address, collectionId, propertyPermissions } = args;

    return {
      address,
      section: 'unique',
      method: 'setTokenPropertyPermissions',
      args: [collectionId, propertyPermissions],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<SetTokenPropertyPermissionsResult> {
    const records = result.filterRecords('common', 'PropertyPermissionSet');

    return records.map(({ event }) => {
      const [collectionId, propertyKey] = event.data as unknown as [u32, Bytes];

      return {
        collectionId: collectionId.toNumber(),
        propertyKey: bytesToString(propertyKey),
      };
    });
  }
}
