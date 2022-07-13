import {
  FeeResponse,
  SubmitTxBody,
  UnsignedTxPayloadResponse,
} from '../types/Api';
import { Section } from './Section';
import { isUnsignedTxPayloadResponse, isSubmitTxBody } from '../utils';
import { isSubmitTxArguments } from '@unique-nft/sdk/extrinsics';

export interface MutationOptions {
  signer?: any;
}

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

  async sign(args: A | UnsignedTxPayloadResponse, options?: MutationOptions) {
    // todo тут сами должны подписать (сбилдить если еще нет, смотри MutationMethodBase или как то так

    const unsigned = isUnsignedTxPayloadResponse(args)
      ? args
      : await this.build(args);

    const { signerPayloadJSON } = unsigned;
    const { signature } = await this.section.client.extrinsics.sign(unsigned);

    return { signature, signerPayloadJSON };
  }

  // eslint-disable-next-line class-methods-use-this
  async submit(args: A | UnsignedTxPayloadResponse | SubmitTxBody) {
    // todo здесь дергаем this.section.client.extrinsics.submit(); и получаем хеш
    const submitTxArguments = isSubmitTxBody(args)
      ? args
      : await this.sign(args);

    return this.section.client.extrinsics.submit(submitTxArguments);
  }

  // eslint-disable-next-line class-methods-use-this
  async submitWatch(args: A | UnsignedTxPayloadResponse | SubmitTxBody) {
    // todo здесь мы будем периодически пинговать GET extrinsics/status
  }

  // eslint-disable-next-line class-methods-use-this
  async submitWaitResult(args: any) {
    // todo здесь мы будем дергать submitWatch и возвращать красивые данные
    const response = await this.section.client.instance({
      method: this.method,
      url: `${this.url}?use=Result`,
      data: args,
    });
    return response.data;
  }
}
