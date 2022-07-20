import {
  isWeb3Injected,
  web3Accounts,
  web3FromSource,
  web3Enable,
} from '@polkadot/extension-dapp';
import {
  InjectedAccountWithMeta,
  Web3AccountsOptions,
} from '@polkadot/extension-inject/types';
import { Account, Provider } from '../src/types';
import { PolkadotAccount } from './account';

async function createAccount(
  injectedAccount: InjectedAccountWithMeta,
): Promise<PolkadotAccount> {
  const injector = await web3FromSource(injectedAccount.meta.source);
  return new PolkadotAccount(injectedAccount, injector);
}

export class PolkadotProvider extends Provider<InjectedAccountWithMeta> {
  constructor(private readonly options: Web3AccountsOptions = {}) {
    super();
  }

  // eslint-disable-next-line class-methods-use-this
  public override async init(): Promise<void> {
    const extensions = await web3Enable('@unique-nft/accounts');
    if (!extensions.length) {
      // todo log error Polkadot extension not found
      return Promise.resolve();
    }

    if (!isWeb3Injected) {
      // todo log error Polkadot extension not installed
      return Promise.resolve();
    }

    return Promise.resolve();
  }

  public override async getAccounts(): Promise<
    Account<InjectedAccountWithMeta>[]
  > {
    const injectedAccounts = await web3Accounts(this.options);
    if (!injectedAccounts.length) {
      // todo log error Polkadot account not found
      return [];
    }

    return Promise.all(injectedAccounts.map((acc) => createAccount(acc)));
  }
}
