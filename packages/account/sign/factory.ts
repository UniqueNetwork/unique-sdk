import { cryptoWaitReady } from '@polkadot/util-crypto';
import { SdkSigner, SignerOptions } from '../sign';
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

export async function createSigner(
  signerOptions: SignerOptions,
): Promise<SdkSigner> {
  await cryptoWaitReady();

  return createSignerSync(signerOptions);
}
