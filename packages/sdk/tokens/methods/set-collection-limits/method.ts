import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { u32 } from '@polkadot/types-codec';
import { TxBuildArguments } from '@unique-nft/sdk/types';
import {
  CollectionLimits,
  SetCollectionLimitsArguments,
  SetCollectionLimitsResult,
} from './types';
import { decodeCollectionLimits } from './utils';

/* eslint-disable class-methods-use-this */

export class SetCollectionLimitsMutation extends MutationMethodBase<
  SetCollectionLimitsArguments,
  SetCollectionLimitsResult
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
  ): Promise<SetCollectionLimitsResult | undefined> {
    const updateCollectionEvent = result.findRecord(
      'unique',
      'CollectionLimitSet',
    );

    if (!updateCollectionEvent) return undefined;

    const [id] = updateCollectionEvent.event.data as unknown as [u32];

    // todo this.sdk.api.rpc.unique.effectiveCollectionLimits -> this.sdk.collection.getCollectionLimits
    const limitsWrap = await this.sdk.api.rpc.unique.effectiveCollectionLimits(
      id.toNumber(),
    );

    const limitsUnWrap = limitsWrap.unwrapOr(null);
    if (!limitsUnWrap) return undefined;
    const limits: CollectionLimits = decodeCollectionLimits(limitsUnWrap);

    return {
      collectionId: id.toNumber(),
      limits,
    };
  }
}
