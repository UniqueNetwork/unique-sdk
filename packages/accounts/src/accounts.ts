import { Account, Provider, ProviderClass, ProviderClass2 } from './types';

export class Accounts {
  private providers = new Map<ProviderClass2<Provider>, Provider>();

  async addProvider<T extends ProviderClass2<Provider>, R extends Provider>(
    ProviderClassLink: T,
    options?: object,
  ): Promise<Provider> {
    const provider: Provider = new ProviderClassLink(options);
    await provider.init();
    this.providers.set(ProviderClassLink, provider);
    return provider;
  }

  getProvider(ProviderClassLink: ProviderClass): Provider | undefined {
    return this.providers.get(ProviderClassLink);
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
