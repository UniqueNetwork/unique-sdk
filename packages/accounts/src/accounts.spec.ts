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

    const account = provider.addSeed(
      'bus ahead nation nice damp recall place dance guide media clap language',
    );
    console.log(
      'account',
      account.instance.address,
      '5HNUuEAYMWEo4cuBW7tuL9mLHR9zSA8H7SdNKsNnYRB9M5TX',
    );
  });
});
