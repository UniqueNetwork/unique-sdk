import { formatBalance } from '@polkadot/util';
import { ApiPromise } from '@polkadot/api';
import { SdkExtrinsics } from '@unique-nft/sdk/extrinsics';
import {
  AddressArguments,
  Balance,
  QueryControllers,
  TransferBuildArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { SdkStateQueries } from '@unique-nft/sdk/state-queries';

interface Sdk {
  api: ApiPromise;
  extrinsics: SdkExtrinsics;
  stateQueries: SdkStateQueries;
}

export class SdkBalance {
  private readonly multiplierToRaw: number;

  constructor(private readonly sdk: Sdk) {
    const tokenDecimals = this.sdk.api.registry.chainDecimals[0];
    this.multiplierToRaw = 10 ** tokenDecimals;
  }

  async get(args: AddressArguments): Promise<Balance> {
    // todo `get`: this.api[section][method]?
    // todo getBalance(address) { this.get('balances', 'all', address);
    const { availableBalance } = await this.sdk.stateQueries.execute({
      controller: QueryControllers.derive,
      section: 'balances',
      method: 'all',
      args: [args.address],
    });

    return {
      amount: availableBalance.toBigInt().toString(),
      formatted: formatBalance(availableBalance, {
        decimals: this.sdk.api.registry.chainDecimals[0],
        withUnit: this.sdk.api.registry.chainTokens[0],
      }),
      // todo formatted -> formatted, withUnit, as number?
    };
  }

  async transfer(args: TransferBuildArguments): Promise<UnsignedTxPayload> {
    const amountRaw = BigInt(args.amount * this.multiplierToRaw);
    return this.sdk.extrinsics.build({
      address: args.address,
      section: 'balances',
      method: 'transfer',
      args: [args.destination, amountRaw],
    });
  }
}
