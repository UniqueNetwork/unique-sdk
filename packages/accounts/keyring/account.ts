import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import {
  Account,
  SignatureType,
  SdkSigner,
  SignResult,
  UnsignedTxPayload,
} from '../src/types';

function createSigner(keyringPair: KeyringPair): SdkSigner {
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
  #signer: SdkSigner;

  constructor(keyringPair: KeyringPair) {
    super(keyringPair);
  }

  public override getSigner(): SdkSigner {
    if (!this.#signer) {
      this.#signer = createSigner(this.instance);
    }

    return this.#signer;
  }
}
