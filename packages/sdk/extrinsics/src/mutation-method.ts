import { Sdk } from '@unique-nft/sdk';
import {
  Balance,
  ObservableSubmitResult,
  SdkSigner,
  SubmitResult,
  SubmittableResultCompleted,
  SubmitTxArguments,
  TxBuildArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { lastValueFrom, switchMap, from, mergeMap, identity } from 'rxjs';
import { SubmitExtrinsicError } from '@unique-nft/sdk/errors';
import { isSubmitTxArguments, isUnsignedTxPayload } from './tx-utils';

export interface MutationOptions {
  signer?: SdkSigner;
}

export type MutationMethod<A, R> = (
  args: A | UnsignedTxPayload | SubmitTxArguments,
  options?: MutationOptions,
) => Promise<SubmittableResultCompleted<R>>;

export interface MutationMethodWrap<A, R> {
  build(args: A): Promise<UnsignedTxPayload>;

  getFee(args: A | UnsignedTxPayload | SubmitTxArguments): Promise<Balance>;

  sign(
    args: A | UnsignedTxPayload,
    options?: MutationOptions,
  ): Promise<SubmitTxArguments>;

  submit(
    args: A | UnsignedTxPayload | SubmitTxArguments,
    options?: MutationOptions,
  ): Promise<Omit<SubmitResult, 'result$'>>;

  submitWatch(
    args: A | UnsignedTxPayload | SubmitTxArguments,
    options?: MutationOptions,
  ): Promise<ObservableSubmitResult<R>>;

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
    options?: MutationOptions,
  ): Promise<SubmitTxArguments> {
    const unsigned = isUnsignedTxPayload(args) ? args : await this.build(args);

    const { signerPayloadJSON } = unsigned;
    const { signature } = await this.sdk.extrinsics.sign(
      unsigned,
      options?.signer,
    );

    return { signature, signerPayloadJSON };
  }

  async submit(
    args: UnsignedTxPayload | SubmitTxArguments | A,
    options?: MutationOptions,
  ): Promise<Omit<SubmitResult, 'result$'>> {
    const submitTxArguments = isSubmitTxArguments(args)
      ? args
      : await this.sign(args, options);

    return this.sdk.extrinsics.submit(submitTxArguments, false);
  }

  // todo - hide async inside Observable and return just Observable<SubmittableResultInProcess<R>
  async submitWatch(
    args: UnsignedTxPayload | SubmitTxArguments | A,
    options?: MutationOptions,
  ): Promise<ObservableSubmitResult<R>> {
    const submitTxArguments = isSubmitTxArguments(args)
      ? args
      : await this.sign(args, options);

    const { result$, hash } = await this.sdk.extrinsics.submit(
      submitTxArguments,
      true,
    );

    const tryParse = async (submittableResult: ISubmittableResult) => {
      const parsed = submittableResult.isError
        ? undefined
        : await this.transformResult(submittableResult);

      return { submittableResult, parsed };
    };

    return {
      hash,
      result$: from(Promise.resolve(result$)).pipe(
        mergeMap(identity),
        switchMap(tryParse),
      ),
    };
  }

  async submitWaitResult(
    args: UnsignedTxPayload | SubmitTxArguments | A,
    options?: MutationOptions,
  ): Promise<SubmittableResultCompleted<R>> {
    const { result$ } = await this.submitWatch(args, options);

    const completed = await lastValueFrom(result$);

    this.checkDispatchError(completed.submittableResult);

    if (completed.parsed === undefined) {
      throw new SubmitExtrinsicError('Invalid parsed data');
    }

    return {
      ...completed,
      isCompleted: true,
      parsed: completed.parsed,
    };
  }

  checkDispatchError(submittableResult: ISubmittableResult) {
    const { dispatchError } = submittableResult;

    if (dispatchError) {
      let details;
      let errorMessage;

      if (dispatchError.isModule) {
        const decoded = this.sdk.api.registry.findMetaError(
          dispatchError.asModule,
        );

        const { docs, name, section } = decoded;
        details = {
          name,
          section,
        };
        errorMessage = docs.join(' ');
      } else {
        errorMessage = dispatchError.toString();
      }

      throw new SubmitExtrinsicError(
        `Dispatch error: ${errorMessage}`,
        details,
      );
    }
  }

  expose() {
    return this.submitWaitResult.bind(this);
  }
}
