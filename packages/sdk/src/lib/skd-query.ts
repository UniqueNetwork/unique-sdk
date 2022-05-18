import { formatBalance } from '@polkadot/util';
import { ApiPromise } from '@polkadot/api';
import { SdkExtrinsics } from '@unique-nft/sdk/extrinsics';
import { validate } from '@unique-nft/sdk/validation';
import {
  AddressArg,
  Balance,
  ChainProperties,
  ISdkQuery,
  SdkOptions,
} from '@unique-nft/sdk/types';

interface Sdk {
  api: ApiPromise;
  extrinsics: SdkExtrinsics;
  options: SdkOptions;
}

export class SkdQuery implements ISdkQuery {
  constructor(private readonly sdk: Sdk) {}

  chainProperties(): ChainProperties {
    return {
      SS58Prefix: this.sdk.api.registry.chainSS58 || 0,
      token: this.sdk.api.registry.chainTokens[0],
      decimals: this.sdk.api.registry.chainDecimals[0],
      wsUrl: this.sdk.options.chainWsUrl,
      genesisHash: this.sdk.api.genesisHash.toHex(), // todo hex?
    };
  }

  async balance(args: AddressArg): Promise<Balance> {
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
}
