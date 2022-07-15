import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeyringProvider } from '../keyring';
import { Accounts } from './accounts';

describe('Accounts', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  it('ok', async () => {
    const accounts = new Accounts();

    const provider = new KeyringProvider();

    accounts.addProvider(KeyringProvider, provider);
    expect(accounts.getProvider(KeyringProvider)).toStrictEqual(provider);

    const alice = provider.addSeed('//Alice');
    const bob = provider.addSeed('//Bob');

    const list = await accounts.getAccounts();
    expect(list).toStrictEqual([alice, bob]);

    const first = await accounts.first();
    expect(first).toStrictEqual(alice);
  });
});
