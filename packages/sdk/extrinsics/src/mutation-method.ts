import { Sdk } from '@unique-nft/sdk';
import {
  Balance,
  ObservableSubmitResult,
  SubmitResult,
  SubmittableResultCompleted,
  SubmitTxArguments,
  TxBuildArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { lastValueFrom, switchMap, from, mergeMap, identity } from 'rxjs';
import {
  SubmitExtrinsicError,
  VerificationFailedError,
} from '@unique-nft/sdk/errors';
import { getDispatchError } from '@unique-nft/sdk/utils';
import {
  isSubmitTxArguments,
  isUnsignedTxPayload,
  isRawPayload,
} from './tx-utils';
import {
  MutationOptions,
  MutationMethodWrap,
  VerificationResult,
} from './types';

export abstract class MutationMethodBase<A, R>
  implements MutationMethodWrap<A, R>
{
  constructor(readonly sdk: Sdk) {}

  // eslint-disable-next-line class-methods-use-this
  protected async verifyArgs(args: A): Promise<VerificationResult> {
    return { isAllowed: true };
  }

  private async verify(args: UnsignedTxPayload | SubmitTxArguments | A) {
    if (isRawPayload(args)) {
      const { isAllowed, message } = await this.verifyArgs(args as A);
      if (!isAllowed) {
        throw new VerificationFailedError(message);
      }
    }
  }

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
    await this.verify(args);

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
    await this.verify(args);

    const submitTxArguments = isSubmitTxArguments(args)
      ? args
      : await this.sign(args, options);

    const { result$, hash } = await this.sdk.extrinsics.submit(
      submitTxArguments,
      true,
    );

    const tryParse = async (submittableResult: ISubmittableResult) => {
      const error = getDispatchError(this.sdk.api, submittableResult);
      if (error) {
        return { submittableResult, error };
      }

      const parsed = submittableResult.isCompleted
        ? await this.transformResult(submittableResult)
        : undefined;

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

    const error = getDispatchError(this.sdk.api, completed.submittableResult);
    if (error) {
      throw new SubmitExtrinsicError(
        `Dispatch error: ${error.message}`,
        error.details,
      );
    }

    if (completed.parsed === undefined) {
      throw new SubmitExtrinsicError('Invalid parsed data');
    }

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
