import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import {
  Account,
  SignatureType,
  Signer,
  SignResult,
  UnsignedTxPayload,
} from '../types';

function createSigner(keyringPair: KeyringPair): Signer {
  return {
    sign: async (unsignedTxPayload: UnsignedTxPayload): Promise<SignResult> => {
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

export class KeyringAccount extends Account<KeyringPair> {
  #signer: Signer;

  constructor(keyringPair: KeyringPair) {
    super(keyringPair);
  }

  public override getSigner(): Signer {
    if (!this.#signer) {
      this.#signer = createSigner(this.instance);
    }

    return this.#signer;
  }
}
