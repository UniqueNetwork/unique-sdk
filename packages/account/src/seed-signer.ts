import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import {
  SdkSigner,
  SignatureType,
  SignResult,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { SeedSignerOptions } from './types';
import * as console from 'console';

export class SeedSigner implements SdkSigner {
  private readonly pair: KeyringPair;

  constructor(options: SeedSignerOptions) {
    this.pair = new Keyring({
      type: options.type || SignatureType.Sr25519,
    }).addFromMnemonic(options.seed);
  }

  public sign(unsignedTxPayload: UnsignedTxPayload): Promise<SignResult> {
    const signatureU8a = this.pair.sign(unsignedTxPayload.signerPayloadHex, {
      withType: true,
    });

    return Promise.resolve({
      signature: u8aToHex(signatureU8a),
      signatureType: this.pair.type as SignatureType,
    });
  }
}
