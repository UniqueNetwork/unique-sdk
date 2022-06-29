import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { u32 } from '@polkadot/types-codec';
import { TxBuildArguments } from '@unique-nft/sdk/types';
import { CollectionIdArguments } from '../collection-by-id/types';
import { SetCollectionLimitsArguments } from './types';

/* eslint-disable class-methods-use-this */

export class SetCollectionLimitsMutation extends MutationMethodBase<
  SetCollectionLimitsArguments,
  CollectionIdArguments
> {
  async transformArgs(
    args: SetCollectionLimitsArguments,
  ): Promise<TxBuildArguments> {
    const {
      address,
      collectionId,
      limits: { ...rest },
    } = args;

    return {
      address,
      section: 'unique',
      method: 'setCollectionLimits',
      args: [collectionId, rest],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<CollectionIdArguments | undefined> {
    const updateCollectionEvent = result.findRecord(
      'unique',
      'CollectionLimitSet',
    );

    if (!updateCollectionEvent) return undefined;

    const [id] = updateCollectionEvent.event.data as unknown as [u32];

    return {
      collectionId: id.toNumber(),
    };
  }
}
