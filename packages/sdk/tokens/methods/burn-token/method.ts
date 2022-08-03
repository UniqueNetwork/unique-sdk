import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@unique-nft/sdk/types';
import { u32, u128 } from '@polkadot/types-codec';
import { PalletEvmAccountBasicCrossAccountIdRepr } from '@unique-nft/unique-mainnet-types';
import {
  BurnItemArguments,
  BurnItemBuildArguments,
  BurnItemResult,
} from './types';

/* eslint-disable class-methods-use-this */

export class BurnItemMutation extends MutationMethodBase<
  BurnItemArguments,
  BurnItemResult
> {
  async transformArgs(
    args: BurnItemArguments,
  ): Promise<BurnItemBuildArguments> {
    const { address, collectionId, tokenId, value } = args;

    return {
      address,
      section: 'unique',
      method: 'burnItem',
      args: [collectionId, tokenId, value],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<BurnItemResult | undefined> {
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
