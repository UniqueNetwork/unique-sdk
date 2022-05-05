import { ApiPromise } from '@polkadot/api';

import {
  ISdkBalance,
  ISdkExtrinsics,
  TransferBuildArgs,
  UnsignedTxPayload,
} from '../types';

export class SdkBalance implements ISdkBalance {
  private readonly multiplierToRaw: number;

  constructor(private readonly extrinsics: ISdkExtrinsics, api: ApiPromise) {
    const tokenDecimals = api.registry.chainDecimals[0];
    this.multiplierToRaw = 10 ** tokenDecimals;
  }

  buildTransfer(args: TransferBuildArgs): Promise<UnsignedTxPayload> {
    const amountRaw = BigInt(args.amount * this.multiplierToRaw);
    return this.extrinsics.build({
      address: args.address,
      section: 'balances',
      method: 'transfer',
      args: [args.destination, amountRaw],
    });
  }
}
