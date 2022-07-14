import { Mutation } from './Mutation';
import { Section } from './Section';
import {
  BalanceTransferBody,
  BalanceTransferParsed,
  AllBalancesResponse,
} from '../types/Api';

export class Balance extends Section {
  public readonly path = `${this.client.options.url}/balance`; // todo см. эксринсики

  public readonly transfer = new Mutation<
    BalanceTransferBody,
    BalanceTransferParsed
  >(this, 'POST', 'transfer'); // todo сюда наверно первым параметром можно this.client передать

  async get(args: { address: string }): Promise<AllBalancesResponse> {
    const response = await this.client.instance({
      method: 'GET',
      url: `${this.path}?address=${args.address}`,
      // todo см. эктсринсики
    });
    return response.data;
  }
}
