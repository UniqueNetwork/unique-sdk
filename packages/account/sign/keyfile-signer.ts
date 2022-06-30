import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import { SignatureType, SignResult } from '../src/types';
import { SdkSigner, UnsignedTxPayload } from './types';
import { KeyfileSignerOptions } from '../sign';

export class KeyfileSigner implements SdkSigner {
  private readonly pair: KeyringPair;

  constructor(private readonly options: KeyfileSignerOptions) {
    this.pair = new Keyring({
      type: options.type || SignatureType.Sr25519,
    }).addFromJson(options.keyfile);
  }

  public async unlock() {
    if (!this.pair.isLocked) return;

    const password = await this.options.passwordCallback();
    if (!password) {
      throw new Error('Password was not received');
    }
    try {
      this.pair.unlock(password);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async sign(unsignedTxPayload: UnsignedTxPayload): Promise<SignResult> {
    await this.unlock();
    const signatureU8a = this.pair.sign(unsignedTxPayload.signerPayloadHex, {
      withType: true,
    });

    return {
      signature: u8aToHex(signatureU8a),
      signatureType: this.pair.type as SignatureType,
    };
  }
}
