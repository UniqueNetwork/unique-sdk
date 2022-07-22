import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@unique-nft/sdk/types';
import { u32 } from '@polkadot/types-codec';
import { addressToCrossAccountId } from '@unique-nft/sdk/utils';
import {
  UnnestTokenArguments,
  UnnestTokenResult,
  UnnestTokenBuildArguments,
} from './types';
import { getNestingTokenAddress } from '../../utils';

/* eslint-disable class-methods-use-this */

export class UnnestTokenMutation extends MutationMethodBase<
  UnnestTokenArguments,
  UnnestTokenResult
> {
  async transformArgs(
    args: UnnestTokenArguments,
  ): Promise<UnnestTokenBuildArguments> {
    const { address, parent, nested } = args;

    const from = addressToCrossAccountId(
      getNestingTokenAddress(parent.collectionId, parent.tokenId),
    );

    const to = addressToCrossAccountId(address);

    return {
      address,
      section: 'unique',
      method: 'transferFrom',
      args: [from, to, nested.collectionId, nested.tokenId, 1],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<UnnestTokenResult | undefined> {
    const record = result.findRecord('common', 'Transfer');

    if (!record) return undefined;

    const [collectionId, tokenId] = record.event.data as unknown as [u32, u32];

    return {
      collectionId: collectionId.toNumber(),
      tokenId: tokenId.toNumber(),
    };
  }
}
