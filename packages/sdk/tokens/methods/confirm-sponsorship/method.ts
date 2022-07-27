import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { SdkError } from '@unique-nft/sdk/errors';
import { u32 } from '@polkadot/types-codec';
import {
  ConfirmSponsorshipArguments,
  ConfirmSponsorshipBuildArguments,
  ConfirmSponsorshipResult,
} from './types';

/* eslint-disable class-methods-use-this */

export class ConfirmSponsorshipMutation extends MutationMethodBase<
  ConfirmSponsorshipArguments,
  ConfirmSponsorshipResult
> {
  async transformArgs(args: ConfirmSponsorshipArguments): Promise<ConfirmSponsorshipBuildArguments> {
    const { address, collectionId } = args;

    const collection = await this.sdk.collections.get_new({ collectionId });
    if (!collection) throw new SdkError(`no collection ${collectionId}`);

    return {
      address,
      section: 'unique',
      method: 'confirmSponsorship',
      args: [
        collectionId,
      ],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<ConfirmSponsorshipResult | undefined> {
    const record = result.findRecord('unique', 'SponsorshipConfirmed');

    if (!record) return undefined;

    const [collectionId, sponsor] = record.event.data as unknown as [u32, string];

    return {
      collectionId: collectionId.toNumber(),
      sponsor,
    };
  }
}
