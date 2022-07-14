import { Mutation } from './Mutation';
import { Section } from './Section';
import {
  BalanceTransferBody,
  BalanceTransferParsed,
  AllBalancesResponse,
} from '../types/Api';

export class Balance extends Section {
  public readonly path = 'balance';

  public readonly baseUrl = `${this.client.options.baseUrl}/${this.path}`;

  public readonly transfer = new Mutation<
    BalanceTransferBody,
    BalanceTransferParsed
  >(this.client, 'POST', `${this.path}/transfer`); // todo сюда наверно первым параметром можно this.client передать

  async get(args: { address: string }): Promise<AllBalancesResponse> {
    const response = await this.client.instance({
      method: 'GET',
      url: `${this.baseUrl}`,
      params: { address: args.address },
    });
    return response.data;
  }
}
