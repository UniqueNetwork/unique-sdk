import {
  MutationCallMode,
  SdkMutationMethod,
  SubmittableResultWithParsed,
  TxBuildArguments,
} from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { Sdk } from '@unique-nft/sdk';
import { lastValueFrom, map } from 'rxjs';

export function buildMutationMethod<A, R>(
  transformArgs: (sdk: Sdk, args: A) => TxBuildArguments,
  transformResult: (sdk: Sdk, result: ISubmittableResult) => R | undefined,
): SdkMutationMethod<A, R> {
  return async function (this: Sdk, args, callMode: MutationCallMode) {
    const transformedArgs = transformArgs(this, args);
    const unsigned = await this.extrinsics.build(transformedArgs);

    if (callMode === MutationCallMode.Build) return unsigned;

    const signResult = await this.extrinsics.sign(unsigned);
    const signed = {
      signature: signResult.signature,
      signerPayloadJSON: unsigned.signerPayloadJSON,
    };

    if (callMode === MutationCallMode.Sign) return signed;

    if (callMode === MutationCallMode.Submit) {
      const { hash } = await this.extrinsics.submit(signed, false);

      return { hash };
    }

    const { result$ } = await this.extrinsics.submit(signed, true);

    const transformed$ = result$.pipe(
      map<ISubmittableResult, SubmittableResultWithParsed<R>>(
        (submittableResult) => ({
            ...submittableResult,
            parsed: transformResult(this, submittableResult),
          }),
      ),
    );

    if (callMode === MutationCallMode.Watch) return transformed$;

    return lastValueFrom(transformed$);
  } as SdkMutationMethod<A, R>;
}
