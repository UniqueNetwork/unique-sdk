import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import {
  CreateCollectionArguments,
  TxBuildArguments,
  CollectionIdArguments,
} from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { u32 } from '@polkadot/types-codec';
import { encodeCollection } from '../../utils';

/* eslint-disable class-methods-use-this */

export class CreateCollectionExMutation extends MutationMethodBase<
  CreateCollectionArguments,
  CollectionIdArguments
> {
  async transformArgs(
    args: CreateCollectionArguments,
  ): Promise<TxBuildArguments> {
    const { address, ...rest } = args;

    const encodedCollection = encodeCollection(
      this.sdk.api.registry,
      rest,
    ).toHex();

    return {
      address,
      section: 'unique',
      method: 'createCollectionEx',
      args: [encodedCollection],
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
