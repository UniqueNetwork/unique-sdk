import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { TxBuildArguments } from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { Sdk } from '@unique-nft/sdk';
import { BalanceTransferResult, TransferBuildArguments } from './types';

/* eslint-disable class-methods-use-this */

export class BalanceTransferMutation extends MutationMethodBase<
  TransferBuildArguments,
  BalanceTransferResult
> {
  private readonly multiplierToRaw: number;

  constructor(sdk: Sdk) {
    super(sdk);
    const tokenDecimals = this.sdk.api.registry.chainDecimals[0];
    this.multiplierToRaw = 10 ** tokenDecimals;
  }

  async transformArgs(args: TransferBuildArguments): Promise<TxBuildArguments> {
    const { address, destination, amount } = args;

    const amountRaw = BigInt(amount * this.multiplierToRaw);

    return {
      address,
      section: 'balances',
      method: 'transfer',
      args: [destination, amountRaw],
    };
  }

  async transformResult(result: ISubmittableResult): Promise<any | undefined> {
    const isSuccess = result.findRecord('system', 'ExtrinsicSuccess');

    return {
      success: !!isSuccess,
    };
  }
}
