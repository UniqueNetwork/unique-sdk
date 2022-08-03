import { cryptoWaitReady, signatureVerify } from '@polkadot/util-crypto';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { UnsignedTxPayload } from '../src/types';
import { KeyringLocalProvider } from './provider';

describe('keyring-local-account', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  it('create account', async () => {
    const provider = new KeyringLocalProvider({
      passwordCallback: () => Promise.resolve('123'),
    });
    await provider.init();

    provider.addUri('//Alice', '123');

    const signMessage = '0x1234567890';

    const account = (await provider.getAccounts())[0];

    const unsigned: UnsignedTxPayload = {
      signerPayloadJSON: {} as SignerPayloadJSON,
      signerPayloadRaw: {} as SignerPayloadRaw,
      signerPayloadHex: signMessage,
    };

    const signResult = await account.getSigner().sign(unsigned);
    expect(signResult).toMatchObject({
      signature: expect.any(String),
      signatureType: expect.any(String),
    });

    const verifyResult = signatureVerify(
      signMessage,
      signResult.signature,
      account.instance.address,
    );
    expect(verifyResult.isValid).toBe(true);
  });
});
