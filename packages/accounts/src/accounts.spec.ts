import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Accounts, KeyringProvider } from './accounts';

describe('Accounts', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  it('create provider', async () => {
    const accounts = new Accounts();

    const provider = new KeyringProvider();

    accounts.addKeyringProvider(provider);

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
