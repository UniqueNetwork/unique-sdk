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

  override async verifyArgs(args: BalanceTransferArguments) {
    const { address, amount } = args;

    const balance = await this.sdk.balance.get({ address });

    const balanceAmount = BigInt(balance.freeBalance.raw);
    const transferAmount = BigInt(amount * this.multiplierToRaw);

    if (balanceAmount < transferAmount) {
      return Promise.resolve({
        isAllowed: false,
        message: 'Balance is too low',
      });
    }

    return Promise.resolve({
      isAllowed: true,
    });
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
