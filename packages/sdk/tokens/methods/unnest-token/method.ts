import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { TxBuildArguments } from '@unique-nft/sdk/types/arguments';
import { ISubmittableResult } from '@unique-nft/sdk/types';
import { u32 } from '@polkadot/types-codec';
import { UnnestTokenArguments, UnnestTokenResult } from './types';
import { getNestingTokenAddress } from '../../utils';

/* eslint-disable class-methods-use-this */

export class UnnestTokenMutation extends MutationMethodBase<
  UnnestTokenArguments,
  UnnestTokenResult
> {
  async transformArgs(args: UnnestTokenArguments): Promise<TxBuildArguments> {
    const { address, parent, nested } = args;

    const from = {
      Ethereum: getNestingTokenAddress(parent.collectionId, parent.tokenId),
    };

    const to = {
      Substrate: address,
    };

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
