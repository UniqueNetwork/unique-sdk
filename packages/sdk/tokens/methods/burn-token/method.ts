import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@unique-nft/sdk/types';
import { u32, u128 } from '@polkadot/types-codec';
import { PalletEvmAccountBasicCrossAccountIdRepr } from '@unique-nft/unique-mainnet-types';
import { addressToCrossAccountId } from '@unique-nft/sdk/utils';
import {
  BurnTokenArguments,
  BurnTokenBuildArguments,
  BurnTokenResult,
} from './types';

/* eslint-disable class-methods-use-this */

export class BurnTokenMutation extends MutationMethodBase<
  BurnTokenArguments,
  BurnTokenResult
> {
  async transformArgs(
    args: BurnTokenArguments,
  ): Promise<BurnTokenBuildArguments> {
    const { address, collectionId, tokenId } = args;

    return {
      address,
      section: 'unique',
      method: 'burnFrom',
      args: [
        collectionId,
        addressToCrossAccountId(args.from || address),
        tokenId,
        args.value || 1,
      ],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<BurnTokenResult | undefined> {
    const burnItemEvent = result.findRecord('common', 'ItemDestroyed');

    if (!burnItemEvent) return undefined;

    const [collectionId, tokenId, address, value] = burnItemEvent.event
      .data as unknown as [
      u32,
      u32,
      PalletEvmAccountBasicCrossAccountIdRepr,
      u128,
    ];

    return {
      collectionId: collectionId.toNumber(),
      tokenId: tokenId.toNumber(),
      address: address.toString(),
      value: value.toNumber(),
    };
  }
}
