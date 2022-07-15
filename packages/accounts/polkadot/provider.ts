import {
  isWeb3Injected,
  web3Accounts,
  web3FromSource,
} from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Account, Provider } from '../src/types';
import { PolkadotAccount } from './account';

async function createAccount(
  injectedAccount: InjectedAccountWithMeta,
): Promise<PolkadotAccount> {
  const injector = await web3FromSource(injectedAccount.meta.source);
  return new PolkadotAccount(injectedAccount, injector);
}

export class PolkadotProvider extends Provider<null, InjectedAccountWithMeta> {
  public readonly instance: null;

  constructor() {
    super();
  }

  // eslint-disable-next-line class-methods-use-this
  public override async init(): Promise<void> {
    if (!isWeb3Injected) {
      throw new Error('Polkadot extension not installed');
    }

    return Promise.resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  public override async getAccounts(): Promise<
    Account<InjectedAccountWithMeta>[]
  > {
    const injectedAccounts = await web3Accounts();
    if (!injectedAccounts.length) {
      throw new Error('Polkadot account not found');
    }

    return Promise.all(injectedAccounts.map((acc) => createAccount(acc)));
  }
}
