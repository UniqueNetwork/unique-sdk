import { validate } from '@unique-nft/sdk/validation';
import { InvalidSignerError } from '@unique-nft/sdk/errors';
import { SdkSigner } from '@unique-nft/sdk';
import { SeedSignerOptions, SignerOptions, UriSignerOptions } from './types';
import { SeedSigner } from './seed-signer';

export async function createSigner(
  signerOptions: SignerOptions,
): Promise<SdkSigner> {
  if ('seed' in signerOptions) {
    await validate(signerOptions, SeedSignerOptions);
    return new SeedSigner(signerOptions.seed);
  }
  if ('uri' in signerOptions) {
    await validate(signerOptions, UriSignerOptions);
    return new SeedSigner(signerOptions.uri);
  }

  if ('keyfile' in signerOptions) {
    // todo add json signer
    throw new InvalidSignerError();
  }

  throw new InvalidSignerError();
}
