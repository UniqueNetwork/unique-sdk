import { AddressArguments, AllBalances } from '@unique-nft/sdk/types';
import { Sdk } from '@unique-nft/sdk';
import { formatBalance } from '@unique-nft/sdk/utils';
import { MutationMethodWrap } from '@unique-nft/sdk/extrinsics';
import {
  BalanceTransferResult,
  BalanceTransferArguments,
} from './methods/transfer/types';
import { BalanceTransferMutation } from './methods/transfer/method';

export class SdkBalance {
  private readonly multiplierToRaw: number;

  transfer: MutationMethodWrap<BalanceTransferArguments, BalanceTransferResult>;

  constructor(private readonly sdk: Sdk) {
    const tokenDecimals = this.sdk.api.registry.chainDecimals[0];
    this.multiplierToRaw = 10 ** tokenDecimals;

    this.transfer = new BalanceTransferMutation(this.sdk);
  }

  async get(args: AddressArguments): Promise<AllBalances> {
    // todo `get`: this.api[section][method]?
    // todo getBalance(address) { this.get('balances', 'all', address);
    const { availableBalance, lockedBalance, freeBalance } =
      await this.sdk.api.derive.balances.all(args.address);

    return {
      availableBalance: formatBalance(this.sdk.api, availableBalance),
      lockedBalance: formatBalance(this.sdk.api, lockedBalance),
      freeBalance: formatBalance(this.sdk.api, freeBalance),
    };
  }
}
