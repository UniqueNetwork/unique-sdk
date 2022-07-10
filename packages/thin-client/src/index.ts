// eslint-disable-next-line max-classes-per-file
import Axios, { AxiosInstance } from 'axios';

const baseUrl = 'http://localhost:3000';

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
  private instance: AxiosInstance;

  private readonly url = `${this.section.path}/${this.path}`;

  constructor(
    private readonly section: Section,
    private readonly method: 'POST' | 'PUT' | 'PATCH',
    private readonly path: string,
  ) {
    this.instance = Axios.create({
      baseURL: baseUrl,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  async build(args: A) {
    // todo post или get выбрать в зависимости от method
    const collectionResponse = await this.instance.post(this.url, args);
    return collectionResponse.data;
  }

  // eslint-disable-next-line class-methods-use-this
  async getFee(args: A) {
    //
  }

  // eslint-disable-next-line class-methods-use-this
  async sign(args: A) {
    // todo тут сами должны подписать (сбилдить если еще нет, смотри MutationMethodBase или как то так
  }

  // eslint-disable-next-line class-methods-use-this
  async submit() {
    // todo здесь дергаем this.section.client.extrinsics.submit(); и получаем хеш
  }

  // eslint-disable-next-line class-methods-use-this
  async submitWatch() {
    // todo здесь мы будем периодически пинговать GET extrinsics/status
  }

  // eslint-disable-next-line class-methods-use-this
  async submitWaitResult() {
    // todo здесь мы будем дергать submitWatch и возвращать красивые данные
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

export class ThinClient {
  public readonly balance = new Balance(this);

  // public readonly extrinsics = new Extrinsics(this);

  constructor(
    public readonly options: {
      url: string;
    },
  ) {}
}
