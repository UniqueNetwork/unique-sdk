import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult, TxBuildArguments } from '@unique-nft/sdk/types';
import { u32, Bytes } from '@polkadot/types-codec';
import { bytesToString } from '@unique-nft/sdk/utils';
import {
  DeleteCollectionPropertiesArguments,
  DeleteCollectionPropertiesResult,
} from './types';

/* eslint-disable class-methods-use-this */

export class DeleteCollectionPropertiesMutation extends MutationMethodBase<
  DeleteCollectionPropertiesArguments,
  DeleteCollectionPropertiesResult
> {
  async transformArgs(
    args: DeleteCollectionPropertiesArguments,
  ): Promise<TxBuildArguments> {
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
    return result.events
      .filter(
        ({ event }) =>
          event.section === 'common' &&
          event.method === 'CollectionPropertyDeleted',
      )
      .map(({ event }) => {
        const [collectionId, propertyKey] = event.data as unknown as [
          u32,
          Bytes,
        ];

        return {
          collectionId: collectionId.toNumber(),
          property: bytesToString(propertyKey),
        };
      });
  }
}
