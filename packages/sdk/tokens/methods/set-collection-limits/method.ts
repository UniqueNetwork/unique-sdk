import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { TxBuildArguments } from '@unique-nft/sdk/types';
import { UpDataStructsCollectionLimitsArguments } from '@unique-nft/sdk/tokens/methods/set-collection-limits/types';
import { CollectionIdArguments } from '@unique-nft/sdk/tokens/methods/collection-by-id/types';
import { u32 } from '@polkadot/types-codec';

/* eslint-disable class-methods-use-this */

export class SetCollectionLimitsMutation extends MutationMethodBase<
  UpDataStructsCollectionLimitsArguments,
  CollectionIdArguments
> {
  async transformArgs(
    args: UpDataStructsCollectionLimitsArguments,
  ): Promise<TxBuildArguments> {
    const { address, collectionId, ...rest } = args;

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
    const createCollectionEvent = result.findRecord(
      'unique',
      'CollectionLimitSet',
    );

    if (!createCollectionEvent) return undefined;

    const [id] = createCollectionEvent.event.data as unknown as [u32];

    return {
      collectionId: id.toNumber(),
    };
  }
}
