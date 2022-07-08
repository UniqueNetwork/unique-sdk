// todo мне это видится как то так

class ThinClient {

  public readonly balance = new Balance(this);
  public readonly extrinsics = new Extrinsics(this);

  constructor(
    public readonly options: {
      url: string,
    },
  ) {
  }


}

abstract class Section {
  abstract readonly path: string;

  constructor(
    public readonly client: ThinClient,
  ) {
  }
}

class Mutation<A, R> {

  private readonly url = this.section.path + '/' + this.path;

  constructor(
    private readonly section: Section,
    private readonly method: 'POST' | 'PUT' | 'PATCH',
    private readonly path: string,
  ) {
  }

  async build(args: A) {
    return; // todo запросик
  }

  async getFee(args: A) {

  }

  async sign(args: A) {
   // todo тут сами должны подписать (сбилдить если еще нет, смотри MutationMethodBase или как то так
  }

  async submit() {
    // todo здесь дергаем this.section.client.extrinsics.submit(); и получаем хеш
  }

  async submitWatch() {
    // todo здесь мы будем периодически пинговать GET extrinsics/status
  }

  async submitWaitResult() {
    // todo здесь мы будем дергать submitWatch и возвращать красивые данные
  }
}

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

class Balance extends Section {

  public readonly path = this.client.options.url + '/' + 'balance';
  public readonly transfer = new Mutation<BalanceTransferRequest, BalanceTransferResponse>(
    this,
    'POST',
    'transfer',
  );


}
