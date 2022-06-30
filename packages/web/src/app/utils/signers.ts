import { ValidationError } from '@unique-nft/sdk/errors';
import { createSignerSync, SignerOptions } from '@unique-nft/account/sign';
import { SdkSigner } from '@unique-nft/sdk/types';
import { validateSeed } from '../validation';

export function createSignerByHeader(authorization: string): SdkSigner {
  const splitterIndex = authorization.indexOf(' ');
  const type = authorization.substring(0, splitterIndex);
  const value = authorization.substring(splitterIndex + 1);
  let signerOptions: SignerOptions;
  switch (type) {
    case 'Seed':
      if (!validateSeed(value)) {
        throw new ValidationError(`Invalid authorization header "${value}"`);
      }
      signerOptions = { seed: value };
      break;
    default:
      throw new ValidationError('Invalid authorization header');
  }
  return createSignerSync(signerOptions);
}
