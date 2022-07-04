import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult, TxBuildArguments } from '@unique-nft/sdk/types';
import { u32 } from '@polkadot/types-codec';
import { NestTokenArguments, NestTokenResult } from './types';
import { getNestingTokenAddress } from '../../utils';

/* eslint-disable class-methods-use-this */

export class NestTokenMutation extends MutationMethodBase<
  NestTokenArguments,
  NestTokenResult
> {
  async transformArgs(args: NestTokenArguments): Promise<TxBuildArguments> {
    const { address, parent, nested } = args;

    const from = {
      Substrate: address,
    };

    const to = {
      Ethereum: getNestingTokenAddress(parent.collectionId, parent.tokenId),
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
  ): Promise<NestTokenResult | undefined> {
    const record = result.findRecord('common', 'Transfer');

    if (!record) return undefined;

    const [collectionId, tokenId] = record.event.data as unknown as [u32, u32];

    return {
      collectionId: collectionId.toNumber(),
      tokenId: tokenId.toNumber(),
    };
  }
}
