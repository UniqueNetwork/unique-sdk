import { ValidationError } from '@unique-nft/sdk/errors';
import {
  createSignerSync,
  SeedSignerOptions,
  UriSignerOptions,
} from '@unique-nft/sdk/sign';
import { SdkSigner } from '@unique-nft/sdk/types';

export function createSignerByHeader(authorization: string): SdkSigner {
  const splitterIndex = authorization.indexOf(' ');
  const type = authorization.substring(0, splitterIndex);
  const value = authorization.substring(splitterIndex + 1);
  let signerOptions;
  switch (type) {
    case 'Seed':
      signerOptions = new SeedSignerOptions(value);
      break;
    case 'Uri':
      signerOptions = new UriSignerOptions(value);
      break;
    default:
      throw new ValidationError('Invalid authorization header');
  }
  return createSignerSync(signerOptions);
}
