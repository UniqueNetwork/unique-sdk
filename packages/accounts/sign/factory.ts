import { SdkSigner, SignerOptions } from './types';
import { SeedSigner } from './seed-signer';
import { KeyfileSigner } from './keyfile-signer';

export function createSignerSync(signerOptions: SignerOptions): SdkSigner {
  try {
    if ('seed' in signerOptions) {
      return new SeedSigner(signerOptions);
    }
    if ('keyfile' in signerOptions) {
      return new KeyfileSigner(signerOptions);
    }
  } catch (err: any) {
    throw new Error(err.message);
  }

  throw new Error('Not known options');
}
