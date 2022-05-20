import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { u8aToHex } from '@polkadot/util';
import { SdkSigner, SignatureType, SignResult } from '@unique-nft/sdk/types';
import { SignType } from './types';

export class SeedSigner implements SdkSigner {
  private readonly pair: KeyringPair;

  constructor(seed: string, type: SignType = SignType.sr25519) {
    this.pair = new Keyring({ type }).addFromMnemonic(seed);
  }

  public sign(payload: HexString): Promise<SignResult> {
    const signatureU8a = this.pair.sign(payload, { withType: true });

    return Promise.resolve({
      signature: u8aToHex(signatureU8a),
      signatureType: this.pair.type as SignatureType,
    });
  }
}
