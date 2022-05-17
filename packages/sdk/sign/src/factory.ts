import { validateSync } from '@unique-nft/sdk/validation';
import { InvalidSignerError } from '@unique-nft/sdk/errors';
import { SdkSigner } from '@unique-nft/sdk';
import {
  KeyfileSignerOptions,
  SeedSignerOptions,
  SignerOptions,
  UriSignerOptions,
} from './types';
import { SeedSigner } from './seed-signer';
import { KeyfileSigner } from './keyfile-signer';

export async function createSigner(
  signerOptions: SignerOptions,
): Promise<SdkSigner> {
  if ('seed' in signerOptions) {
    validateSync(signerOptions, SeedSignerOptions);
    return SeedSigner.createSignerWithSeed(signerOptions);
  }
  if ('uri' in signerOptions) {
    validateSync(signerOptions, UriSignerOptions);
    return SeedSigner.createSignerWithUri(signerOptions);
  }
  if ('keyfile' in signerOptions) {
    validateSync(signerOptions, KeyfileSignerOptions);
    return KeyfileSigner.createSigner(signerOptions);
  }

  throw new InvalidSignerError('Not known options');
}
