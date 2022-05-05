import {ApiPromise} from "@polkadot/api";

import {
  ISdkBalance,
  ISdkExtrinsics,
  SubmitResult,
  SubmitTxArgs,
  TransferBuildArgs,
  UnsignedTxPayload,
} from '../types';

export class SdkBalance implements ISdkBalance {
  constructor(private readonly extrinsics: ISdkExtrinsics, readonly api: ApiPromise) {}

  buildTransfer(args: TransferBuildArgs): Promise<UnsignedTxPayload> {
    return this.extrinsics.build({
      address: args.address,
      section: 'balances',
      method: 'transfer',
      args: [args.destination, args.amount],
    });
  }

  submitTransfer(args: SubmitTxArgs): Promise<SubmitResult> {
    return this.extrinsics.submit(args);
  }
}
