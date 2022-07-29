import {
  Balance,
  ObservableSubmitResult,
  SdkSigner,
  SubmitResult,
  SubmittableResultCompleted,
  SubmitTxArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';

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

export interface VerificationResult {
  isAllow: boolean;
  message?: string;
}
