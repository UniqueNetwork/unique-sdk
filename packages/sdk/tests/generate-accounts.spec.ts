import { Keyring } from '@polkadot/keyring';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { generateAccount, getAccountFromMnemonic } from '@unique-nft/sdk/sign';
import { ValidationError } from '@unique-nft/sdk/errors';

describe('Generate accounts', () => {
  it('generate - ok', async () => {
    await expect(async () => {
      const password = '1234567890';
      const newAccount = await generateAccount({ password });

      const account = new Keyring({ type: 'sr25519' }).addFromJson(
        newAccount.keyfile as KeyringPair$Json,
      );
      account.unlock(password);
    }).not.toThrowError();
  });

  it('get from mnemonic - ok', async () => {
    await expect(async () => {
      const password = '1234567890';
      const newAccount = await generateAccount({ password });

      const account = await getAccountFromMnemonic({
        mnemonic: newAccount.mnemonic,
        password,
      });

      const keypair = new Keyring({ type: 'sr25519' }).addFromJson(
        account.keyfile as KeyringPair$Json,
      );
      keypair.unlock(password);
    }).not.toThrowError();
  });

  it('invalid pass - fail', async () => {
    await expect(async () => {
      const password = '1234567890';
      const newAccount = await generateAccount({ password });

      const keypair = new Keyring({ type: 'sr25519' }).addFromJson(
        newAccount.keyfile as KeyringPair$Json,
      );
      keypair.unlock('invalid pass');
    }).rejects.toThrowError();
  });

  it('invalid mnemonic - fail', async () => {
    const mnemonic = 'test mnemonic';
    await expect(async () => {
      const password = '1234567890';
      await getAccountFromMnemonic({
        mnemonic,
        password,
      });
    }).rejects.toThrowError(
      new ValidationError({ mnemonic }, 'Invalid mnemonic phrase'),
    );
  });
});
