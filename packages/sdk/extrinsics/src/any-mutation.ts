/* eslint-disable class-methods-use-this */
import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { TxBuildArguments } from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';

export class AnyMutation extends MutationMethodBase<TxBuildArguments, boolean> {
  async transformArgs(args: TxBuildArguments): Promise<TxBuildArguments> {
    return args;
  }

  async transformResult(result: ISubmittableResult): Promise<boolean> {
    const success = result.findRecord('system', 'ExtrinsicSuccess');

    return !!success;
  }
}
