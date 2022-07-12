import { Mutation } from './Mutation';
import { Section } from './Section';

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

export class Balance extends Section {
  public readonly path = `${this.client.options.url}/balance`;

  public readonly transfer = new Mutation<
    BalanceTransferRequest,
    BalanceTransferResponse
  >(this, 'POST', 'transfer');
}
