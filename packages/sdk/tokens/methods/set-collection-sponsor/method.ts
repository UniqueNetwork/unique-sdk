import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { SdkError } from '@unique-nft/sdk/errors';
import { u32 } from '@polkadot/types-codec';

import { TxBuildArguments } from '@unique-nft/sdk/types';
import {
  SetCollectionSponsorArguments,
  SetCollectionSponsorResult,
} from './types';

/* eslint-disable class-methods-use-this */

export class SetCollectionSponsorMutation extends MutationMethodBase<
  SetCollectionSponsorArguments,
  SetCollectionSponsorResult
> {
  async transformArgs(args: SetCollectionSponsorArguments): Promise<TxBuildArguments> {
    const { address, newSponsor, collectionId } = args;

    const collection = await this.sdk.collections.get_new({ collectionId });
    if (!collection) throw new SdkError(`no collection ${collectionId}`);

    return {
      address,
      section: 'unique',
      method: 'setCollectionSponsor',
      args: [
        collectionId,
        newSponsor,
      ],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<SetCollectionSponsorResult | undefined> {

    const record = result.findRecord('unique', 'CollectionSponsorSet');

    if (!record) return undefined;

    const [collectionId, sponsor] = record.event.data as unknown as [u32, string];

    return {
      collectionId: collectionId.toNumber(),
      sponsor,
    };
  }
}
