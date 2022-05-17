import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { u8aToHex } from '@polkadot/util';
import { SdkSigner } from '@unique-nft/sdk';
import { InvalidSignerError } from '@unique-nft/sdk/errors';
import { SeedSignerOptions, SignType, UriSignerOptions } from './types';

export class SeedSigner implements SdkSigner {
  public static createSeed(options: SeedSignerOptions) {
    try {
      return new SeedSigner(options.seed, options.type);
    } catch (err: any) {
      throw new InvalidSignerError(`Failed to create: ${err.message}`);
    }
  }

  public static createUri(options: UriSignerOptions) {
    try {
      return new SeedSigner(options.uri, options.type);
    } catch (err: any) {
      throw new InvalidSignerError(`Failed to create: ${err.message}`);
    }
  }

  private readonly pair: KeyringPair;

  constructor(seed: string, type: SignType = SignType.sr25519) {
    this.pair = new Keyring({ type }).addFromMnemonic(seed);
  }

  public sign(payload: HexString): HexString {
    const signatureU8a = this.pair.sign(payload, { withType: true });
    return u8aToHex(signatureU8a);
  }
}
