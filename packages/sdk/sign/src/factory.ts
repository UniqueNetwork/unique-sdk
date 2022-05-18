import { cryptoWaitReady } from '@polkadot/util-crypto';
import { validateSync } from '@unique-nft/sdk/validation';
import { InvalidSignerError } from '@unique-nft/sdk/errors';
import { SdkSigner } from '@unique-nft/sdk/types';
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
  await cryptoWaitReady();

  if ('seed' in signerOptions) {
    validateSync(signerOptions, SeedSignerOptions);
    try {
      return new SeedSigner(signerOptions.seed, signerOptions.type);
    } catch (err: any) {
      throw new InvalidSignerError(err.message);
    }
  }
  if ('uri' in signerOptions) {
    validateSync(signerOptions, UriSignerOptions);
    try {
      return new SeedSigner(signerOptions.uri, signerOptions.type);
    } catch (err: any) {
      throw new InvalidSignerError(err.message);
    }
  }
  if ('keyfile' in signerOptions) {
    validateSync(signerOptions, KeyfileSignerOptions);
    try {
      return new KeyfileSigner(signerOptions);
    } catch (err: any) {
      throw new InvalidSignerError(err.message);
    }
  }

  throw new InvalidSignerError('Not known options');
}
