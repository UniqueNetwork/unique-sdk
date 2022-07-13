import { Mutation } from './Mutation';
import { Section } from './Section';
import {
  BalanceTransferBody,
  BalanceTransferParsed,
  AllBalancesResponse,
} from '../types/Api';

export class Balance extends Section {
  public readonly path = `${this.client.options.url}/balance`;

  public readonly transfer = new Mutation<
    BalanceTransferBody,
    BalanceTransferParsed
  >(this, 'POST', 'transfer');

  async get(args: { address: string }): Promise<AllBalancesResponse> {
    const response = await this.client.instance({
      method: 'GET',
      url: `${this.path}?address=${args.address}`,
    });
    return response.data;
  }
}
