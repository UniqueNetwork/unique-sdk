import { Keyring } from '@polkadot/keyring';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { u8aToHex } from '@polkadot/util';
import { SdkSigner } from '@unique-nft/sdk';
import { InvalidSignerError } from '@unique-nft/sdk/errors';
import { KeyfileSignerOptions, SignType } from './types';

export class KeyfileSigner implements SdkSigner {
  public static async create(options: KeyfileSignerOptions) {
    const password = await options.passwordCallback();
    if (!password) {
      throw new InvalidSignerError(
        'Failed to create: Password was not received',
      );
    }
    try {
      return new KeyfileSigner(
        options.keyfile as KeyringPair$Json,
        password,
        options.type,
      );
    } catch (err: any) {
      throw new InvalidSignerError(`Failed to create: ${err.message}`);
    }
  }

  private readonly pair: KeyringPair;

  constructor(
    keyfile: KeyringPair$Json,
    password: string,
    type: SignType = SignType.sr25519,
  ) {
    this.pair = new Keyring({ type }).addFromJson(keyfile);
    this.pair.unlock(password);
  }

  public sign(payload: HexString): HexString {
    const signatureU8a = this.pair.sign(payload, { withType: true });
    return u8aToHex(signatureU8a);
  }
}
