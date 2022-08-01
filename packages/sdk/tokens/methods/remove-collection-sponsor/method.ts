import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { SdkError } from '@unique-nft/sdk/errors';
import { u32 } from '@polkadot/types-codec';
import {TxBuildArguments} from "@unique-nft/sdk/types";
import {
  RemoveCollectionSponsorArguments,
  RemoveCollectionSponsorResult,
} from './types';

/* eslint-disable class-methods-use-this */

export class RemoveCollectionSponsorMutation extends MutationMethodBase<
  RemoveCollectionSponsorArguments,
  RemoveCollectionSponsorResult
> {
  async transformArgs(args: RemoveCollectionSponsorArguments): Promise<TxBuildArguments> {
    const { address, collectionId } = args;

    const collection = await this.sdk.collections.get_new({ collectionId });
    if (!collection) throw new SdkError(`no collection ${collectionId}`);

    return {
      address,
      section: 'unique',
      method: 'removeCollectionSponsor',
      args: [
        collectionId,
      ],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<RemoveCollectionSponsorResult | undefined> {
    const record = result.findRecord('unique', 'CollectionSponsorRemoved');
    if (!record) return undefined;

    const [collectionId] = record.event.data as unknown as [u32];
    return {
      collectionId: collectionId.toNumber(),
    };
  }
}
