import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult, TxBuildArguments } from '@unique-nft/sdk/types';
import { addressToCrossAccountId } from '@unique-nft/sdk/utils';
import { u32 } from '@polkadot/types-codec';
import { PalletEvmAccountBasicCrossAccountIdRepr } from '@unique-nft/unique-mainnet-types';
import { TransferFromArguments, TransferFromResult } from './types';

/* eslint-disable class-methods-use-this */

export class TransferFromMutation extends MutationMethodBase<
  TransferFromArguments,
  TransferFromResult
> {
  async transformArgs(args: TransferFromArguments): Promise<TxBuildArguments> {
    const { address, from, to, collectionId, tokenId } = args;

    return {
      address,
      section: 'unique',
      method: 'transferFrom',
      args: [
        addressToCrossAccountId(from),
        addressToCrossAccountId(to),
        collectionId,
        tokenId,
        1,
      ],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<TransferFromResult | undefined> {
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
