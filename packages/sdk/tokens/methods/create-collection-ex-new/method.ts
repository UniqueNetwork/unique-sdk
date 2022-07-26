import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { TxBuildArguments } from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { u32 } from '@polkadot/types-codec';

import { CollectionIdArguments } from '../../types/shared';
import { CreateCollectionNewArguments } from './types';
import { encode } from './utils';

/* eslint-disable class-methods-use-this */

export class CreateCollectionExNewMutation extends MutationMethodBase<
  CreateCollectionNewArguments,
  CollectionIdArguments
> {
  async transformArgs(
    args: CreateCollectionNewArguments,
  ): Promise<TxBuildArguments> {
    const { address } = args;

    const encoded = encode(this.sdk.api.registry, args);

    return {
      address,
      section: 'unique',
      method: 'createCollectionEx',
      args: [encoded],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<CollectionIdArguments | undefined> {
    const createCollectionEvent = result.findRecord(
      'common',
      'CollectionCreated',
    );

    if (!createCollectionEvent) return undefined;

    const [id] = createCollectionEvent.event.data as unknown as [u32];

    return {
      collectionId: id.toNumber(),
    };
  }
}
