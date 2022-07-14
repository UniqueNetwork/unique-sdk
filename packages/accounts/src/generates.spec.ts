import { Keyring } from '@polkadot/keyring';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { generateAccount, getAccountFromMnemonic } from './generates';

describe('Generates', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  it.each([undefined, '', 'pass1'])('generate ok - %s', async (password) => {
    await expect(async () => {
      const newAccount = await generateAccount({});

      const account = new Keyring({ type: 'sr25519' }).addFromJson(
        newAccount.keyfile as KeyringPair$Json,
      );
      account.unlock(password);
    }).not.toThrowError();
  });

  it('get from mnemonic ok', async () => {
    const account1 = await generateAccount({});

    const account2 = await getAccountFromMnemonic({
      mnemonic: account1.mnemonic,
    });

    expect(account1.seed).toEqual(account2.seed);
    expect(account1.keyfile.address).toEqual(account2.keyfile.address);
  });

  it('invalid pass fail', async () => {
    const newAccount = await generateAccount({});

    const keypair = new Keyring({ type: 'sr25519' }).addFromJson(
      newAccount.keyfile as KeyringPair$Json,
    );

    expect(() => keypair.unlock('pass2')).toThrowError();
  });

  it('invalid mnemonic fail', async () => {
    const mnemonic = 'invalid mnemonic';
    await expect(async () => {
      await getAccountFromMnemonic({
        mnemonic,
      });
    }).rejects.toThrowError(new Error('Invalid bip39 mnemonic specified'));
  });
});
