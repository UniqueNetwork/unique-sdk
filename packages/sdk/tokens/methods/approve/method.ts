import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { TxBuildArguments } from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { SdkError } from '@unique-nft/sdk/errors';
import { u32 } from '@polkadot/types-codec';
import { ApproveArguments, ApproveResult } from './types';

/* eslint-disable class-methods-use-this */

export class Approve extends MutationMethodBase<ApproveArguments, ApproveResult> {
  async transformArgs(args: ApproveArguments): Promise<TxBuildArguments> {
    const { spender, collectionId, tokenId, isApprove } = args;

    const collection = await this.sdk.collections.get_new({ collectionId });
    if (!collection) throw new SdkError(`no collection ${collectionId}`);

    const token = await this.sdk.tokens.get_new({ collectionId, tokenId });
    if (!token) throw new SdkError(`no token ${tokenId} in collection ${collectionId}`);

    return {
      address: spender,
      section: 'unique',
      method: 'approve',
      args: [{ substrate: spender }, collectionId, tokenId, isApprove ? 1 : 0],
    };
  }

  async transformResult(result: ISubmittableResult): Promise<ApproveResult | undefined> {
    const record = result.findRecord('common', 'Approved');

    if (!record) return undefined;

    const [collectionId, tokenId] = record.event.data as unknown as [u32, u32];

    return {
      collectionId: collectionId.toNumber(),
      tokenId: tokenId.toNumber(),
    };
  }
}
