import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { u128, u32 } from '@polkadot/types-codec';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { PalletEvmAccountBasicCrossAccountIdRepr } from '@unique-nft/unique-mainnet-types';
import { addressToCrossAccountId } from '@unique-nft/sdk/utils';
import {
  AddTokensArguments,
  AddTokenBuildArguments,
  AddTokensResult,
} from './types';

export class AddTokensMutation extends MutationMethodBase<
  AddTokensArguments,
  AddTokensResult
> {
  // eslint-disable-next-line class-methods-use-this
  async transformArgs(
    args: AddTokensArguments,
  ): Promise<AddTokenBuildArguments> {
    const { address, amount, recipient, collectionId } = args;

    return {
      address,
      section: 'unique',
      method: 'createItem',
      args: [
        collectionId,
        addressToCrossAccountId(recipient || address),
        { fungible: { value: amount } },
      ],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async transformResult(
    result: ISubmittableResult,
  ): Promise<AddTokensResult | undefined> {
    const itemCreatedEvent = result.findRecord('common', 'ItemCreated');

    if (!itemCreatedEvent) return undefined;

    const [collectionId, , recipient, amount] = itemCreatedEvent.event
      .data as unknown as [
      u32,
      u32,
      PalletEvmAccountBasicCrossAccountIdRepr,
      u128,
    ];

    return {
      collectionId: collectionId.toNumber(),
      recipient: recipient.toString(),
      amount: amount.toNumber(),
    };
  }
}
