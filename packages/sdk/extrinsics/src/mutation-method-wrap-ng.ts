import { Sdk } from '@unique-nft/sdk';
import {
  SubmitResult,
  SubmittableResultCompleted,
  SubmittableResultInProcess,
  SubmitTxArguments,
  TxBuildArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { lastValueFrom, Observable, switchMap } from 'rxjs';
import { SubmitExtrinsicError } from '@unique-nft/sdk/errors';

const isUnsignedTxPayload = (args: unknown): args is UnsignedTxPayload =>
  typeof args === 'object' && !!args && 'signerPayloadJSON' in args;

const isSubmitTxArguments = (args: unknown): args is SubmitTxArguments =>
  isUnsignedTxPayload(args) && 'signature' in args;

export type MutationMethodNg<A, R> = (
  args: A | UnsignedTxPayload | SubmitTxArguments,
) => Promise<SubmittableResultCompleted<R>>;

export interface MutationMethodWrapNg<A, R> {
  build(args: A): Promise<UnsignedTxPayload>;

  sign(args: A | UnsignedTxPayload): Promise<SubmitTxArguments>;

  submit(
    args: A | UnsignedTxPayload | SubmitTxArguments,
  ): Promise<Omit<SubmitResult, 'result$'>>;

  submitWatch(
    args: A | UnsignedTxPayload | SubmitTxArguments,
  ): Promise<Observable<SubmittableResultInProcess<R>>>;

  submitWaitResult: MutationMethodNg<A, R>;

  expose(): MutationMethodNg<A, R>;
}

export abstract class MutationMethodNgBase<A, R>
  implements MutationMethodWrapNg<A, R>
{
  constructor(readonly sdk: Sdk) {}

  abstract transformArgs(args: A): Promise<TxBuildArguments>;

  abstract transformResult(result: ISubmittableResult): Promise<R | undefined>;

  async build(args: A): Promise<UnsignedTxPayload> {
    const transformedArgs = await this.transformArgs(args);

    return this.sdk.extrinsics.build(transformedArgs);
  }

  async sign(args: UnsignedTxPayload | A): Promise<SubmitTxArguments> {
    const unsigned = isUnsignedTxPayload(args) ? args : await this.build(args);

    const { signerPayloadJSON } = unsigned;
    const { signature } = await this.sdk.extrinsics.sign(unsigned);

    return { signature, signerPayloadJSON };
  }

  async submit(
    args: UnsignedTxPayload | SubmitTxArguments | A,
  ): Promise<Omit<SubmitResult, 'result$'>> {
    const submitTxArguments = isSubmitTxArguments(args)
      ? args
      : await this.sign(args);

    return this.sdk.extrinsics.submit(submitTxArguments, false);
  }

  // todo - hide async inside Observable and return just Observable<SubmittableResultInProcess<R>
  async submitWatch(
    args: UnsignedTxPayload | SubmitTxArguments | A,
  ): Promise<Observable<SubmittableResultInProcess<R>>> {
    const submitTxArguments = isSubmitTxArguments(args)
      ? args
      : await this.sign(args);

    const { result$ } = await this.sdk.extrinsics.submit(
      submitTxArguments,
      true,
    );

    return result$.pipe<SubmittableResultInProcess<R>>(
      switchMap(async (submittableResult) => {
        const parsed = await this.transformResult(submittableResult);

        if (submittableResult.isCompleted && !parsed) {
          throw new SubmitExtrinsicError(`Extrinsic completed with no result`);
        }

        return { ...submittableResult, parsed };
      }),
    );
  }

  async submitWaitResult(
    args: UnsignedTxPayload | SubmitTxArguments | A,
  ): Promise<SubmittableResultCompleted<R>> {
    const submitted$ = await this.submitWatch(args);

    const completed = await lastValueFrom(submitted$);

    if (!completed.parsed) throw new SubmitExtrinsicError();

    return {
      ...completed,
      isCompleted: true,
      parsed: completed.parsed,
    };
  }

  expose() {
    return this.submitWaitResult.bind(this);
  }
}
