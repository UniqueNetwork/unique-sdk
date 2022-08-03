import { KeyringPair, KeyringPair$Meta } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeypairType } from '@polkadot/util-crypto/types';
import keyring from '@polkadot/ui-keyring';

import { Account, Provider } from '../src/types';
import { KeyringLocalOptions } from './types';
import { KeyringLocalAccount } from './account';

export class KeyringLocalProvider extends Provider<KeyringPair> {
  constructor(private readonly options: KeyringLocalOptions = {}) {
    super();
  }

  public override async init(): Promise<void> {
    await cryptoWaitReady();

    keyring.loadAll({
      ss58Format: this.options.ss58Format,
      genesisHash: this.options.genesisHash,
      type: this.options.type,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public addUri(
    suri: string,
    password?: string,
    meta?: KeyringPair$Meta,
    type?: KeypairType,
  ): void {
    keyring.addUri(suri, password, meta, type);
  }

  public override async getAccounts(): Promise<Account<KeyringPair>[]> {
    return keyring.getAccounts().map((account) => {
      const pair = keyring.getPair(account.address);
      return new KeyringLocalAccount(pair, this.options.passwordCallback);
    });
  }
}
