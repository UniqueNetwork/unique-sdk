// eslint-disable-next-line max-classes-per-file
import Axios, { AxiosInstance } from 'axios';
import { UnsignedTxPayloadResponse } from './types/Api';

interface BalanceTransferRequest {
  address: string;
  destination: string;
  amount: number;
}

interface BalanceTransferResponse {
  address: string;
  destination: string;
  amount: number;
}

// eslint-disable-next-line max-classes-per-file
class Mutation<A, R> {
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
// eslint-disable-next-line max-classes-per-file
abstract class Section {
  abstract readonly path: string;

  constructor(public readonly client: ThinClient) {}
}

class Balance extends Section {
  public readonly path = `${this.client.options.url}/balance`;

  public readonly transfer = new Mutation<
    BalanceTransferRequest,
    BalanceTransferResponse
  >(this, 'POST', 'transfer');
}

class Extrinsics extends Section {
  public readonly path = `${this.client.options.url}/extrinsic`;

  // private readonly url = `${this.url}/extrinsic`;

  async getFee(args: any) {
    const response = await this.client.instance({
      method: 'POST',
      url: `${this.path}/calculate-fee`,
      data: args,
    });
    return response.data;
  }

  async sign(args: any) {
    const response = await this.client.instance({
      method: 'POST',
      url: `${this.path}/sign`,
      headers: {
        Authorization: 'Seed //Bob',
      },
      data: args,
    });
    return response.data;
  }

  async submit(args: any) {
    const response = await this.client.instance({
      method: 'POST',
      url: `${this.path}/submit`,
      headers: {
        Authorization: 'Seed //Bob',
      },
      data: args,
    });
    return response.data;
  }
}

export class ThinClient {
  public instance: AxiosInstance;

  public readonly extrinsics = new Extrinsics(this);

  public readonly balance = new Balance(this);

  constructor(
    public readonly options: {
      url: string;
    },
  ) {
    this.instance = Axios.create({
      baseURL: this.options.url,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
