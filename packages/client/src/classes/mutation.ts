import {
  ExtrinsicResultResponse,
  FeeResponse,
  SubmitResultResponse,
  SubmitTxBody,
  UnsignedTxPayloadResponse,
} from '../types/api';
import { isUnsignedTxPayloadResponse, isSubmitTxBody, sleep } from '../utils';
import { IClient, MutationOptions } from '../types/interfaces';

export class Mutation<A, R> {
  public readonly url: string;

  constructor(
    private readonly client: IClient,
    private readonly method: 'POST' | 'PUT' | 'PATCH',
    private readonly path: string,
  ) {
    this.url = `${this.client.options.baseUrl}/${this.path}`;
  }

  async build(args: A): Promise<UnsignedTxPayloadResponse> {
    const response = await this.client.instance({
      method: this.method,
      url: this.url,
      params: { use: 'Build' },
      data: args,
    });
    return response.data;
  }

  async getFee(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<FeeResponse> {
    const payload =
      isUnsignedTxPayloadResponse(args) || isSubmitTxBody(args)
        ? args
        : await this.build(args);

    return this.client.extrinsics.getFee(payload);
  }

  async sign(
    args: A | UnsignedTxPayloadResponse,
    options?: MutationOptions,
  ): Promise<SubmitTxBody> {
    if (!this.client.options.signer) throw new Error('not signer');

    const unsigned = isUnsignedTxPayloadResponse(args)
      ? args
      : await this.build(args);

    const { signerPayloadJSON } = unsigned;
    const { signature } = await this.client.extrinsics.sign(
      unsigned,
      options?.signer,
    );
    return { signature, signerPayloadJSON };
  }

  async submit(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<SubmitResultResponse> {
    const submitTxArguments = isSubmitTxBody(args)
      ? args
      : await this.sign(args);

    return this.client.extrinsics.submit(submitTxArguments);
  }

  // async submitWatch(
  //   args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  // ): Promise<ExtrinsicResultResponse> {
  //   // todo здесь мы будем периодически пинговать GET extrinsics/status
  // }

  async submitWaitResult(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<R> {
    // : Promise<SubmittableResultCompleted<R>>
    // todo здесь мы будем дергать submitWatch и возвращать красивые данные
    const { hash } = await this.submit(args);
    let checkStatusResult: ExtrinsicResultResponse<R> | undefined;
    let i = 0;
    while (
      (!checkStatusResult || !checkStatusResult?.isCompleted) &&
      i <= this.client.params.maximumNumberOfStatusRequests
    ) {
      i += 1;
      // eslint-disable-next-line no-await-in-loop
      checkStatusResult = await this.client.extrinsics.status(hash);
      if (checkStatusResult.isCompleted && !checkStatusResult.isError)
        return checkStatusResult.parsed;
      if (checkStatusResult.isError) {
        throw new Error();
      }
      // eslint-disable-next-line no-await-in-loop
      await sleep(this.client.params.waitBetweenStatusRequestsInMs);
    }
    throw new Error();
  }
}
