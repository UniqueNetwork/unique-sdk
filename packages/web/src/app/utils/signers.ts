import { ValidationError } from '@unique-nft/sdk/errors';
import { SdkSigner } from '@unique-nft/sdk/types';
import { Sdk } from '@unique-nft/sdk';
import { validateSeed } from '../validation';

export function createSignerByHeader(
  sdk: Sdk,
  authorization: string,
): SdkSigner {
  const splitterIndex = authorization.indexOf(' ');
  const type = authorization.substring(0, splitterIndex);
  const value = authorization.substring(splitterIndex + 1);
  switch (type) {
    case 'Seed':
      if (!validateSeed(value)) {
        throw new ValidationError(`Invalid authorization header "${value}"`);
      }
      return sdk.accounts.getSigner(value);
    default:
      throw new ValidationError('Invalid authorization header');
  }
}
