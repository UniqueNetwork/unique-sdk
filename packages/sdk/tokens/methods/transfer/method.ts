import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@unique-nft/sdk/types';
import { addressToCrossAccountId } from '@unique-nft/sdk/utils';
import { u32 } from '@polkadot/types-codec';
import { PalletEvmAccountBasicCrossAccountIdRepr } from '@unique-nft/unique-mainnet-types';
import {
  TransferArguments,
  TransferBuildArguments,
  TransferResult,
} from './types';

/* eslint-disable class-methods-use-this */

export class TransferMutation extends MutationMethodBase<
  TransferArguments,
  TransferResult
> {
  async transformArgs(
    args: TransferArguments,
  ): Promise<TransferBuildArguments> {
    const { from, to, collectionId, tokenId } = args;

    return {
      address: from,
      section: 'unique',
      method: 'transfer',
      args: [addressToCrossAccountId(to), collectionId, tokenId, 1],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<TransferResult | undefined> {
    const record = result.findRecord('common', 'Transfer');

    if (!record) return undefined;

    const [collectionId, tokenId, sender, recipient] = record.event
      .data as unknown as [
      u32,
      u32,
      PalletEvmAccountBasicCrossAccountIdRepr,
      PalletEvmAccountBasicCrossAccountIdRepr,
    ];

    const from = sender.isSubstrate
      ? { Substrate: sender.asSubstrate.toString() }
      : { Ethereum: sender.asEthereum.toString() };

    const to = recipient.isSubstrate
      ? { Substrate: recipient.asSubstrate.toString() }
      : { Ethereum: recipient.asEthereum.toString() };

    return {
      collectionId: collectionId.toNumber(),
      tokenId: tokenId.toNumber(),
      from,
      to,
    };
  }
}
