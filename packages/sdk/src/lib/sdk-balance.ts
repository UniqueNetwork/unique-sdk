import { SdkExtrinsics, UnsignedTxPayload } from '@unique-nft/sdk/extrinsics';
import { ApiPromise } from '@polkadot/api';
import { validate } from '@unique-nft/sdk/validation';

import { ISdkBalance, TransferBuildArgs } from '../types';

interface Sdk {
  api: ApiPromise;
  extrinsics: SdkExtrinsics;
}

export class SdkBalance implements ISdkBalance {
  private readonly multiplierToRaw: number;

  constructor(private readonly sdk: Sdk) {
    const tokenDecimals = this.sdk.api.registry.chainDecimals[0];
    this.multiplierToRaw = 10 ** tokenDecimals;
  }

  buildTransfer(args: TransferBuildArgs): Promise<UnsignedTxPayload> {
    validate(args, TransferBuildArgs);
    const amountRaw = BigInt(args.amount * this.multiplierToRaw);
    return this.sdk.extrinsics.build({
      address: args.address,
      section: 'balances',
      method: 'transfer',
      args: [args.destination, amountRaw],
    });
  }
}
