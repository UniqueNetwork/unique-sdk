import {
  ExtrinsicResultResponse,
  FeeResponse,
  SubmitResultResponse,
  SubmitTxBody,
  UnsignedTxPayloadResponse,
} from '../types/Api';
import { Section } from './Section';
import { isUnsignedTxPayloadResponse, isSubmitTxBody, sleep } from '../utils';

export interface MutationOptions {
  signer?: any;
}

export interface SubmittableResultCompleted<T> {
  submittableResult?: any;
  isCompleted: true;
  parsed: T;
}

// todo вот надо balance, extrinsics положить в ./sections, а эти вспомогательные штуки оставить в classes да
export class Mutation<A, R> {
  private readonly url = `${this.section.path}/${this.path}`;

  constructor(
    private readonly section: Section,
    private readonly method: 'POST' | 'PUT' | 'PATCH',
    private readonly path: string,
  ) {}

  async build(args: A): Promise<UnsignedTxPayloadResponse> {
    const response = await this.section.client.instance({
      method: this.method,
      url: `${this.url}?use=Build`,
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

    return this.section.client.extrinsics.getFee(payload);
  }

  async sign(
    args: A | UnsignedTxPayloadResponse,
    options?: MutationOptions,
  ): Promise<SubmitTxBody> {
    // todo тут сами должны подписать (сбилдить если еще нет, смотри MutationMethodBase или как то так

    if (!this.section.client.signer) throw new Error('not signer');

    const unsigned = isUnsignedTxPayloadResponse(args)
      ? args
      : await this.build(args);

    const { signerPayloadJSON } = unsigned;
    const { signature } = await this.section.client.extrinsics.sign(
      unsigned,
      this.section.client.signer,
    );
    return { signature, signerPayloadJSON };
  }

  // eslint-disable-next-line class-methods-use-this
  async submit(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<SubmitResultResponse> {
    // todo здесь дергаем this.section.client.extrinsics.submit(); и получаем хеш
    const submitTxArguments = isSubmitTxBody(args)
      ? args
      : await this.sign(args);

    return this.section.client.extrinsics.submit(submitTxArguments);
  }

  async submitWatch(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<ExtrinsicResultResponse> {
    // todo здесь мы будем периодически пинговать GET extrinsics/status
    const { hash } = await this.submit(args);
    let checkStatusResult;
    let i = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) { // todo while !checkStatusResult.isCompleted
      i += 1;
      // eslint-disable-next-line no-await-in-loop
      await sleep(20_000); // todo это должен быть настраиваем параметр, лучше секунды 3-5
      // eslint-disable-next-line no-await-in-loop
      checkStatusResult = await this.section.client.extrinsics.status(hash);
      if (checkStatusResult.isCompleted && !checkStatusResult.isError)
        return checkStatusResult;
      if (i > 100 || checkStatusResult.isError) { // todo 100 в константы, и лучше может 5-10
        throw new Error();
      }
    }
  }

  async submitWaitResult(
    args: A | UnsignedTxPayloadResponse | SubmitTxBody,
  ): Promise<ExtrinsicResultResponse> {
    // : Promise<SubmittableResultCompleted<R>>
    // todo здесь мы будем дергать submitWatch и возвращать красивые данные
    // const response = await this.section.client.instance({
    //   method: this.method,
    //   url: `${this.url}?use=Result`,
    //   headers: {
    //     Authorization: 'Seed //Bob',
    //   },
    //   data: args,
    // });
    // return {
    //   isCompleted: true,
    //   parsed: response.data,
    // };
    return this.submitWatch(args);
  }
}
