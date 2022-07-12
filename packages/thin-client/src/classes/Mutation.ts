import { UnsignedTxPayloadResponse } from '../types/Api';
import { Section } from './Section';

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

  // eslint-disable-next-line class-methods-use-this
  async getFee(args: A) {
    const payload = await this.build(args);
    return this.section.client.extrinsics.getFee(payload);
  }

  // eslint-disable-next-line class-methods-use-this
  async sign(args: A) {
    // todo тут сами должны подписать (сбилдить если еще нет, смотри MutationMethodBase или как то так
    const response = await this.build(args);
    const result = await this.section.client.extrinsics.sign(response);
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async submit(args: any) {
    // todo здесь дергаем this.section.client.extrinsics.submit(); и получаем хеш
    const buildResponse = await this.build(args);
    const result = await this.section.client.extrinsics.sign(buildResponse);
    const response = await this.section.client.extrinsics.submit(result);
    return response.data;
  }

  // eslint-disable-next-line class-methods-use-this
  async submitWatch() {
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
