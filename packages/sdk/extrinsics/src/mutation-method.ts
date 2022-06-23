import { Sdk } from '@unique-nft/sdk';
import {
  Balance, SdkSigner,
  SubmitResult,
  SubmittableResultCompleted,
  SubmittableResultInProcess,
  SubmitTxArguments,
  TxBuildArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import {
  lastValueFrom,
  Observable,
  switchMap,
  from,
  mergeMap,
  identity,
} from 'rxjs';
import { SubmitExtrinsicError } from '@unique-nft/sdk/errors';
import { isSubmitTxArguments, isUnsignedTxPayload } from './tx-utils';

export type MutationMethod<A, R> = (
  args: A | UnsignedTxPayload | SubmitTxArguments,
) => Promise<SubmittableResultCompleted<R>>;

export interface MutationMethodWrap<A, R> {
  build(args: A): Promise<UnsignedTxPayload>;

  sign(
    args: A | UnsignedTxPayload
  ): Promise<SubmitTxArguments>;

  getFee(args: A | UnsignedTxPayload | SubmitTxArguments): Promise<Balance>;

  submit(
    args: A | UnsignedTxPayload | SubmitTxArguments,
  ): Promise<Omit<SubmitResult, 'result$'>>;

  submitWatch(
    args: A | UnsignedTxPayload | SubmitTxArguments,
  ): Observable<SubmittableResultInProcess<R>>;

  submitWaitResult: MutationMethod<A, R>;

  expose(): MutationMethod<A, R>;
}

export abstract class MutationMethodBase<A, R>
  implements MutationMethodWrap<A, R>
{
  constructor(readonly sdk: Sdk) {}

  abstract transformArgs(args: A): Promise<TxBuildArguments>;

  abstract transformResult(result: ISubmittableResult): Promise<R | undefined>;

  async build(args: A): Promise<UnsignedTxPayload> {
    const transformedArgs = await this.transformArgs(args);

    return this.sdk.extrinsics.build(transformedArgs);
  }

  async getFee(
    args: A | UnsignedTxPayload | SubmitTxArguments,
  ): Promise<Balance> {
    const payload =
      isSubmitTxArguments(args) || isUnsignedTxPayload(args)
        ? args
        : await this.build(args);

    return this.sdk.extrinsics.getFee(payload);
  }

  async sign(
    args: UnsignedTxPayload | A,
    signer: SdkSigner | undefined = this.sdk.signer,
  ): Promise<SubmitTxArguments> {
    const unsigned = isUnsignedTxPayload(args) ? args : await this.build(args);

    const { signerPayloadJSON } = unsigned;
    const { signature } = await this.sdk.extrinsics.sign(unsigned, signer);

    return { signature, signerPayloadJSON };
  }

  async submit(
    args: UnsignedTxPayload | SubmitTxArguments | A,
    signer: SdkSigner | undefined = this.sdk.signer,
  ): Promise<Omit<SubmitResult, 'result$'>> {
    const submitTxArguments = isSubmitTxArguments(args)
      ? args
      : await this.sign(args, signer);

    return this.sdk.extrinsics.submit(submitTxArguments, false);
  }

  // todo - hide async inside Observable and return just Observable<SubmittableResultInProcess<R>
  submitWatch(
    args: UnsignedTxPayload | SubmitTxArguments | A,
    signer: SdkSigner | undefined = this.sdk.signer,
  ): Observable<SubmittableResultInProcess<R>> {
    const getSubmittableResult$ = async () => {
      const submitTxArguments = isSubmitTxArguments(args)
        ? args
        : await this.sign(args, signer);

      const { result$ } = await this.sdk.extrinsics.submit(
        submitTxArguments,
        true,
      );

      return result$;
    };

    const tryParse = async (submittableResult: ISubmittableResult) => {
      const parsed = await this.transformResult(submittableResult);

      return { submittableResult, parsed };
    };

    return from(getSubmittableResult$()).pipe(
      mergeMap(identity),
      switchMap(tryParse),
    );
  }

  async submitWaitResult(
    args: UnsignedTxPayload | SubmitTxArguments | A,
    signer: SdkSigner | undefined = this.sdk.signer,
  ): Promise<SubmittableResultCompleted<R>> {
    const submitted$ = await this.submitWatch(args, signer);

    const completed = await lastValueFrom(submitted$);

    if (completed.parsed === undefined) throw new SubmitExtrinsicError();

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
