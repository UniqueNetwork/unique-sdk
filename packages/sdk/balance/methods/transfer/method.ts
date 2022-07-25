import { Sdk } from '@unique-nft/sdk';
import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import {
  BalanceTransferResult,
  BalanceTransferArguments,
  BalanceTransferBuildArguments,
} from './types';

/* eslint-disable class-methods-use-this */

export class BalanceTransferMutation extends MutationMethodBase<
  BalanceTransferArguments,
  BalanceTransferResult
> {
  private readonly multiplierToRaw: number;

  constructor(sdk: Sdk) {
    super(sdk);
    const tokenDecimals = this.sdk.api.registry.chainDecimals[0];
    this.multiplierToRaw = 10 ** tokenDecimals;
  }

  async transformArgs(
    args: BalanceTransferArguments,
  ): Promise<BalanceTransferBuildArguments> {
    const { address, destination, amount } = args;

    const amountRaw = BigInt(amount * this.multiplierToRaw);

    return {
      address,
      section: 'balances',
      method: 'transfer',
      args: [destination, amountRaw],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<BalanceTransferResult | undefined> {
    const isSuccess = result.findRecord('system', 'ExtrinsicSuccess');

    return {
      success: !!isSuccess,
    };
  }
}
