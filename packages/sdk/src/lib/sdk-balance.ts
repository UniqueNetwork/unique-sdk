import { UnsignedTxPayload } from '@unique-nft/sdk/extrinsics';
import { Sdk } from './sdk';

import { validate } from '../utils/validator';
import {
  ISdkBalance,
  TransferBuildArgs,
} from '../types';

export class SdkBalance implements ISdkBalance {
  private readonly multiplierToRaw: number;

  constructor(
    private readonly sdk: Sdk,
  ) {
    const tokenDecimals = this.sdk.api.registry.chainDecimals[0];
    this.multiplierToRaw = 10 ** tokenDecimals;
  }

  async buildTransfer(args: TransferBuildArgs): Promise<UnsignedTxPayload> {
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
