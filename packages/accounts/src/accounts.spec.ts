import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeyringProvider } from '../keyring';
import { KeyringLocalProvider } from '../keyring-local';
import { Accounts } from './accounts';

describe('Accounts', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  it('ok', async () => {
    const accounts = new Accounts();
    await accounts.addProvider(KeyringProvider);
    await accounts.addProvider(KeyringLocalProvider);

    const keyringProvider = accounts.getProvider(
      KeyringProvider,
    ) as KeyringProvider;

    const keyringLocalProvider = accounts.getProvider(
      KeyringLocalProvider,
    ) as KeyringLocalProvider;

    const alice = keyringProvider.addSeed('//Alice');
    const bob = keyringProvider.addSeed('//Bob');

    keyringLocalProvider.addUri('//Eve');
    const eve = (await keyringLocalProvider.getAccounts())[0];

    const list = await accounts.getAccounts();

    const first = await accounts.first();

    expect(accounts.getProvider(KeyringProvider)).toStrictEqual(
      keyringProvider,
    );
    expect(accounts.getProvider(KeyringLocalProvider)).toStrictEqual(
      keyringLocalProvider,
    );
    expect(list).toStrictEqual([alice, bob, eve]);
    expect(first).toStrictEqual(alice);
  });
});
