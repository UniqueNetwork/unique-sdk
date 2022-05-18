import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { u8aToHex } from '@polkadot/util';
import { InvalidSignerError } from '@unique-nft/sdk/errors';
import { SdkSigner } from '@unique-nft/sdk/types';
import { KeyfileSignerOptions, SignType } from './types';

export class KeyfileSigner implements SdkSigner {
  private readonly pair: KeyringPair;

  constructor(private readonly options: KeyfileSignerOptions) {
    this.pair = new Keyring({
      type: options.type || SignType.sr25519,
    }).addFromJson(options.keyfile);
  }

  public async unlock() {
    if (!this.pair.isLocked) return;

    const password = await this.options.passwordCallback();
    if (!password) {
      throw new InvalidSignerError('Password was not received');
    }
    try {
      this.pair.unlock(password);
    } catch (err: any) {
      throw new InvalidSignerError(err.message);
    }
  }

  public async sign(payload: HexString): Promise<HexString> {
    await this.unlock();
    const signatureU8a = this.pair.sign(payload, { withType: true });
    return u8aToHex(signatureU8a);
  }
}
