import { Account, Provider } from './types';

type ProviderClass = { new (o: object): Provider };

export class Accounts {
  private providers = new Map<ProviderClass, Provider>();

  addProvider(classLink: ProviderClass, provider: Provider) {
    this.providers.set(classLink, provider);
  }

  getProvider(ProviderClass: ProviderClass): Provider | undefined {
    return this.providers.get(ProviderClass);
  }

  async getAccounts(): Promise<Account[]> {
    const accounts = [];
    const providers = this.providers.values();
    // eslint-disable-next-line no-restricted-syntax
    for (const provider of providers) {
      accounts.push(provider.getAccounts());
    }
    const result: Account[][] = await Promise.all(accounts);
    return Promise.resolve(result.flat(1));
  }

  async first(): Promise<Account | undefined> {
    const accounts = await this.getAccounts();
    return accounts.find((a) => !!a);
  }
}
