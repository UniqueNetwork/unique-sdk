import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { u8aToHex } from '@polkadot/util';
import { SdkSigner, SignatureType, SignResult } from '@unique-nft/sdk/types';
import { SeedSignerOptions } from './types';

export class SeedSigner implements SdkSigner {
  private readonly pair: KeyringPair;

  constructor(options: SeedSignerOptions) {
    this.pair = new Keyring({
      type: options.type || SignatureType.Sr25519,
    }).addFromMnemonic(options.seed);
  }

  public sign(payload: HexString): Promise<SignResult> {
    const signatureU8a = this.pair.sign(payload, { withType: true });

    return Promise.resolve({
      signature: u8aToHex(signatureU8a),
      signatureType: this.pair.type as SignatureType,
    });
  }
}
