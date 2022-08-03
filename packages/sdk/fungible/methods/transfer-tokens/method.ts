import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { SdkError } from '@unique-nft/sdk/errors';
import { u128, u32 } from '@polkadot/types-codec';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { PalletEvmAccountBasicCrossAccountIdRepr } from '@unique-nft/unique-mainnet-types';
import { addressToCrossAccountId } from '@unique-nft/sdk/utils';
import {
  TransferTokensArguments,
  TransferTokensResult,
  TransferTokensBuildArguments,
} from './types';

export class TransferTokensMutation extends MutationMethodBase<
  TransferTokensArguments,
  TransferTokensResult
> {
  async transformArgs(
    args: TransferTokensArguments,
  ): Promise<TransferTokensBuildArguments> {
    const { address, amount, recipient, collectionId } = args;

    const collection = await this.sdk.fungible.getCollection({ collectionId });
    if (!collection)
      throw new SdkError(`No collection with id ${collectionId}`);

    const amountRaw = BigInt(amount * 10 ** collection.decimals);

    return {
      address,
      section: 'unique',
      method: 'transfer',
      args: [addressToCrossAccountId(recipient), collectionId, 0, amountRaw],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async transformResult(
    result: ISubmittableResult,
  ): Promise<TransferTokensResult | undefined> {
    const itemCreatedEvent = result.findRecord('common', 'Transfer');

    if (!itemCreatedEvent) return undefined;

    const [collectionId, , sender, recipient, amount] = itemCreatedEvent.event
      .data as unknown as [
      u32,
      u32,
      PalletEvmAccountBasicCrossAccountIdRepr,
      PalletEvmAccountBasicCrossAccountIdRepr,
      u128,
    ];

    return {
      collectionId: collectionId.toNumber(),
      sender: sender.toString(),
      recipient: recipient.toString(),
      amount: amount.toNumber(),
    };
  }
}
