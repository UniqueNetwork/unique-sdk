import { Account, Provider } from '../src/types';
import { MetamaskAccount } from './account';
import { win } from './types';

export class MetamaskProvider extends Provider<string> {
  // eslint-disable-next-line class-methods-use-this
  public override async init(): Promise<void> {
    return Promise.resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  public override async getAccounts(): Promise<Account<string>[]> {
    if (typeof win === 'undefined') {
      return [];
    }
    if (!win.ethereum) {
      return [];
    }
    let addressList: string[] = [];
    try {
      addressList = await win.ethereum.request({
        method: 'eth_requestAccounts',
      });
    } catch (err: any) {
      return [];
    }

    return addressList.map((address) => new MetamaskAccount(address));
  }
}
