import { Mutation } from './Mutation';
import { Section } from './Section';
import { BalanceTransferBody, BalanceTransferParsed } from '../types/Api';

export class Balance extends Section {
  public readonly path = `${this.client.options.url}/balance`;

  public readonly transfer = new Mutation<
    BalanceTransferBody,
    BalanceTransferParsed
  >(this, 'POST', 'transfer');
}
