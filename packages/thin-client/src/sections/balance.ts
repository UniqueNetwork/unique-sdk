import { Mutation } from '../classes/Mutation';
import { Section } from '../classes/Section';
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
  >(this.client, 'POST', `${this.path}/transfer`);

  async get(args: { address: string }): Promise<AllBalancesResponse> {
    const response = await this.client.instance({
      method: 'GET',
      baseURL: this.baseUrl,
      url: '',
      params: { address: args.address },
    });
    return response.data;
  }
}
