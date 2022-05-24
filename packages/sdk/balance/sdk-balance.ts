import { formatBalance } from '@polkadot/util';
import { ApiPromise } from '@polkadot/api';
import { SdkExtrinsics } from '@unique-nft/sdk/extrinsics';
import { validate } from '@unique-nft/sdk/validation';
import {
  UnsignedTxPayload,
  TransferBuildArgs,
  AddressArg,
  Balance,
} from '@unique-nft/sdk/types';

interface Sdk {
  api: ApiPromise;
  extrinsics: SdkExtrinsics;
}

export class SdkBalance {
  private readonly multiplierToRaw: number;

  constructor(private readonly sdk: Sdk) {
    const tokenDecimals = this.sdk.api.registry.chainDecimals[0];
    this.multiplierToRaw = 10 ** tokenDecimals;
  }

  async get(args: AddressArg): Promise<Balance> {
    await validate(args, AddressArg);
    // todo `get`: this.api[section][method]?
    // todo getBalance(address) { this.get('balances', 'all', address);
    const { availableBalance } = await this.sdk.api.derive.balances.all(
      args.address,
    );

    return {
      amount: availableBalance.toBigInt().toString(),
      formatted: formatBalance(availableBalance, {
        decimals: this.sdk.api.registry.chainDecimals[0],
        withUnit: this.sdk.api.registry.chainTokens[0],
      }),
      // todo formatted -> formatted, withUnit, as number?
    };
  }

  async transfer(args: TransferBuildArgs): Promise<UnsignedTxPayload> {
    await validate(args, TransferBuildArgs);
    const amountRaw = BigInt(args.amount * this.multiplierToRaw);
    return this.sdk.extrinsics.build({
      address: args.address,
      section: 'balances',
      method: 'transfer',
      args: [args.destination, amountRaw],
    });
  }
}
