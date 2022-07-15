import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeyringProvider } from '../keyring';
import { Accounts } from './accounts';

describe('Accounts', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  it('create provider', async () => {
    const accounts = new Accounts();

    const provider = new KeyringProvider();

    accounts.addProvider(KeyringProvider, provider);
    expect(accounts.getProvider(KeyringProvider)).toStrictEqual(provider);

    const alice = provider.addSeed('//Alice');
    const bob = provider.addSeed('//Bob');
    expect(accounts.getAccounts()).toStrictEqual([alice, bob]);

    expect(accounts.first()).toStrictEqual(alice);
  });
});
