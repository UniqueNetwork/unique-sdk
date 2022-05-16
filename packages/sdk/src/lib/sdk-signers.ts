import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';

export interface SdkSigner {
  sign(payload: string): HexString;
}

function signWithPair(pair: KeyringPair, payload: string): HexString {
  const signatureU8a = pair.sign(payload, { withType: true });
  return u8aToHex(signatureU8a);
}

export class SeedSigner implements SdkSigner {
  constructor(private readonly seed: string) {}

  public sign(payload: string): HexString {
    const pair = new Keyring({ type: 'sr25519' }).addFromMnemonic(this.seed);
    return signWithPair(pair, payload);
  }
}
