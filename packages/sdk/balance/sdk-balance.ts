import {
  AddressArguments,
  AllBalances,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { formatBalance } from '@unique-nft/sdk/utils';
import { MutationMethodWrap } from '@unique-nft/sdk/extrinsics';
import { BalanceTransferMutation } from '@unique-nft/sdk/balance/methods/transfer/method';
import { Sdk } from '@unique-nft/sdk';
import {
  BalanceTransferResult,
  TransferBuildArguments,
} from './methods/transfer/types';

export class SdkBalance {
  private readonly multiplierToRaw: number;

  transfer: MutationMethodWrap<TransferBuildArguments, BalanceTransferResult>;

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

  async transferOld(args: TransferBuildArguments): Promise<UnsignedTxPayload> {
    const amountRaw = BigInt(args.amount * this.multiplierToRaw);
    return this.sdk.extrinsics.build({
      address: args.address,
      section: 'balances',
      method: 'transfer',
      args: [args.destination, amountRaw],
    });
  }
}
