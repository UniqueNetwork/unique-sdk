import { Keyring } from '@polkadot/keyring';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { generateAccount, getAccountFromMnemonic } from '@unique-nft/sdk/sign';
import { ValidationError } from '@unique-nft/sdk/errors';
import { cryptoWaitReady } from '@polkadot/util-crypto';

describe('Sdk Accounts', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  it.each([undefined, '', 'pass1'])('generate ok - %s', async (password) => {
    await expect(async () => {
      const newAccount = await generateAccount({ password });

      const account = new Keyring({ type: 'sr25519' }).addFromJson(
        newAccount.keyfile as KeyringPair$Json,
      );
      account.unlock(password);
    }).not.toThrowError();
  });

  it('get from mnemonic ok', async () => {
    const account1 = await generateAccount({ password: 'pass1' });

    const account2 = await getAccountFromMnemonic({
      mnemonic: account1.mnemonic,
      password: 'pass1',
    });

    expect(account1.seed).toEqual(account2.seed);
    expect(account1.keyfile.address).toEqual(account2.keyfile.address);
  });

  it('different seeds', async () => {
    const account1 = await generateAccount({ password: 'pass1' });

    const account2 = await getAccountFromMnemonic({
      mnemonic: account1.mnemonic,
      password: 'pass2',
    });

    expect(account1.seed).not.toEqual(account2.seed);
    expect(account1.keyfile.address).not.toEqual(account2.keyfile.address);
  });

  it('invalid pass fail', async () => {
    const newAccount = await generateAccount({ password: 'pass1' });

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
        password: 'pass1',
      });
    }).rejects.toThrowError(
      new ValidationError('Invalid bip39 mnemonic specified'),
    );
  });
});
