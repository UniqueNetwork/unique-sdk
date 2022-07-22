import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import {
  Account,
  SignatureType,
  SdkSigner,
  SignResult,
  UnsignedTxPayload,
} from '../src/types';
import { PasswordCallback } from './types';

function createSigner(
  keyringPair: KeyringPair,
  passwordCallback?: PasswordCallback,
): SdkSigner {
  return {
    sign: async (unsignedTxPayload: UnsignedTxPayload): Promise<SignResult> => {
      if (keyringPair.isLocked && passwordCallback) {
        const password = await passwordCallback(keyringPair);
        keyringPair.unlock(password);
      }

      const signature = await keyringPair.sign(
        unsignedTxPayload.signerPayloadHex,
        {
          withType: true,
        },
      );

      return {
        signature: u8aToHex(signature),
        signatureType: keyringPair.type as SignatureType,
      };
    },
  };
}

export class KeyringLocalAccount extends Account<KeyringPair> {
  #signer: SdkSigner;

  constructor(
    keyringPair: KeyringPair,
    private readonly passwordCallback?: PasswordCallback,
  ) {
    super(keyringPair);
  }

  public override getSigner(): SdkSigner {
    if (!this.#signer) {
      this.#signer = createSigner(this.instance, this.passwordCallback);
    }

    return this.#signer;
  }
}
