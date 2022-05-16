import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { u8aToHex } from '@polkadot/util';
import { SdkSigner } from './types';

export class SeedSigner implements SdkSigner {
  private readonly pair: KeyringPair;

  constructor(seed: string) {
    this.pair = new Keyring({ type: 'sr25519' }).addFromMnemonic(seed);
  }

  public sign(payload: string): HexString {
    const signatureU8a = this.pair.sign(payload, { withType: true });
    return u8aToHex(signatureU8a);
  }
}
