import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult, TxBuildArguments } from '@unique-nft/sdk/types';
import { u32, Bytes } from '@polkadot/types-codec';
import { bytesToString } from '@unique-nft/sdk/utils';
import {
  SetCollectionPropertiesArguments,
  SetCollectionPropertiesResult,
} from './types';

/* eslint-disable class-methods-use-this */

export class SetCollectionPropertiesMutation extends MutationMethodBase<
  SetCollectionPropertiesArguments,
  SetCollectionPropertiesResult
> {
  async transformArgs(
    args: SetCollectionPropertiesArguments,
  ): Promise<TxBuildArguments> {
    const { address, collectionId, properties } = args;

    return {
      address,
      section: 'unique',
      method: 'setCollectionProperties',
      args: [collectionId, properties],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<SetCollectionPropertiesResult> {
    const records = result.filterRecords('common', 'CollectionPropertySet');

    return records.map(({ event }) => {
      const [collectionId, propertyKey] = event.data as unknown as [u32, Bytes];

      return {
        collectionId: collectionId.toNumber(),
        propertyKey: bytesToString(propertyKey),
      };
    });
  }
}
