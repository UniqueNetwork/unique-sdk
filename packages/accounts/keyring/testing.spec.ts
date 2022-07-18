import { cryptoWaitReady, signatureVerify } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { KeyringAccount } from './account';
import { SignatureType, UnsignedTxPayload } from '../src/types';

describe('keyring-account', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  it('create account', async () => {
    const keyring = new Keyring({
      type: SignatureType.Sr25519,
    });

    const keyringPair = keyring.addFromMnemonic('//Alice');

    const signMessage = '0x1234567890';

    const account = new KeyringAccount(keyringPair);
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
