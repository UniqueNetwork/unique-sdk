import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import {
  KeyringOptions,
  KeyringPair,
  KeyringPair$Json,
} from '@polkadot/keyring/types';
import { Provider, Account } from '../src/types';
import { KeyringAccount } from './account';

export class KeyringProvider extends Provider<KeyringPair, Keyring> {
  readonly #bySeed: Map<string, KeyringAccount>;

  constructor(private options?: KeyringOptions) {
    super();
    this.instance = new Keyring(options);

    this.#bySeed = new Map<string, KeyringAccount>();
  }

  // eslint-disable-next-line class-methods-use-this
  public override async init(): Promise<void> {
    await cryptoWaitReady();
  }

  public override async getAccounts(): Promise<Account<KeyringPair>[]> {
    return this.instance.pairs.map((p) => new KeyringAccount(p));
  }

  addSeed(seed: string): Account<KeyringPair> {
    const keyringPair: KeyringPair = this.instance.addFromMnemonic(seed);

    return new KeyringAccount(keyringPair);
  }

  addKeyfile(
    keyfile: KeyringPair$Json,
    password?: string,
  ): Account<KeyringPair> {
    const keyringPair: KeyringPair = this.instance.addFromJson(keyfile);
    if (password) {
      keyringPair.unlock(password);
    }
    return new KeyringAccount(keyringPair);
  }
}
