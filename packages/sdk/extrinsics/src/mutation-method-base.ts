import { Sdk } from '@unique-nft/sdk';
import {
  MutationCallMode,
  MutationMethodWrap,
  SubmitResult,
  SubmittableResultTransformed,
  SubmitTxArguments,
  TxBuildArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { lastValueFrom, Observable, switchMap } from 'rxjs';

export abstract class MutationMethodBase<A, R>
  implements MutationMethodWrap<A, R>
{
  constructor(readonly sdk: Sdk) {}

  getMethod() {
    return this.use.bind(this);
  }

  use(args: A): Promise<UnsignedTxPayload>;

  use(
    args: A,
    callMode: MutationCallMode.Build | 'Build',
  ): Promise<UnsignedTxPayload>;

  use(args: A, callMode: MutationCallMode.Sign): Promise<SubmitTxArguments>;

  use(
    args: A,
    callMode: MutationCallMode.Submit | 'Submit',
  ): Promise<Omit<SubmitResult, 'result$'>>;

  use(
    args: A,
    callMode: MutationCallMode.Watch | 'Watch',
  ): Promise<Observable<SubmittableResultTransformed<R>>>;

  use(
    args: A,
    callMode: MutationCallMode.WaitCompleted | 'WaitCompleted',
  ): Promise<SubmittableResultTransformed<R>>;

  async use(args: A, callMode?: MutationCallMode | string) {
    const transformedArgs = await this.transformArgs(args);
    const unsigned = await this.sdk.extrinsics.build(transformedArgs);

    if (!callMode || callMode === MutationCallMode.Build) return unsigned;

    const signResult = await this.sdk.extrinsics.sign(unsigned);
    const signed = {
      signature: signResult.signature,
      signerPayloadJSON: unsigned.signerPayloadJSON,
    };

    if (callMode === MutationCallMode.Sign) return signed;

    if (callMode === MutationCallMode.Submit) {
      const { hash } = await this.sdk.extrinsics.submit(signed, false);

      return { hash };
    }

    const { result$ } = await this.sdk.extrinsics.submit(signed, true);

    const transformed$ = result$.pipe<SubmittableResultTransformed<R>>(
      switchMap(async (submittableResult) => {
        const parsed = await this.transformResult(submittableResult);

        return { ...submittableResult, parsed };
      }),
    );

    if (callMode === MutationCallMode.Watch) return transformed$;

    return lastValueFrom(transformed$);
  }

  abstract transformArgs(args: A): Promise<TxBuildArguments>;

  abstract transformResult(result: ISubmittableResult): Promise<R | undefined>;
}
