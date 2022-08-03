import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@unique-nft/sdk/types';
import { u32, Bytes } from '@polkadot/types-codec';
import { bytesToString } from '@unique-nft/sdk/utils';
import {
  DeleteCollectionPropertiesArguments,
  DeleteCollectionPropertiesResult,
  DeleteCollectionPropertiesBuildArguments,
} from './types';

/* eslint-disable class-methods-use-this */

export class DeleteCollectionPropertiesMutation extends MutationMethodBase<
  DeleteCollectionPropertiesArguments,
  DeleteCollectionPropertiesResult
> {
  async transformArgs(
    args: DeleteCollectionPropertiesArguments,
  ): Promise<DeleteCollectionPropertiesBuildArguments> {
    const { address, collectionId, propertyKeys } = args;

    return {
      address,
      section: 'unique',
      method: 'deleteCollectionProperties',
      args: [collectionId, propertyKeys],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<DeleteCollectionPropertiesResult> {
    const records = result.filterRecords('common', 'CollectionPropertyDeleted');

    return records.map(({ event }) => {
      const [collectionId, propertyKey] = event.data as unknown as [u32, Bytes];

      return {
        collectionId: collectionId.toNumber(),
        propertyKey: bytesToString(propertyKey),
      };
    });
  }
}
