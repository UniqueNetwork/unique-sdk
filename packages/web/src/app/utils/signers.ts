import { ValidationError } from '@unique-nft/sdk/errors';
import { SdkSigner } from '@unique-nft/sdk/types';
import { KeyringProvider } from '@unique-nft/accounts/keyring';
import { validateSeed } from '../validation';

export function createSignerByHeader(authorization: string): SdkSigner {
  const splitterIndex = authorization.indexOf(' ');
  const type = authorization.substring(0, splitterIndex);
  const value = authorization.substring(splitterIndex + 1);
  switch (type) {
    case 'Seed':
      if (!validateSeed(value)) {
        throw new ValidationError(`Invalid authorization header "${value}"`);
      }
      return new KeyringProvider({
        type: 'sr25519',
      })
        .addSeed(value)
        ?.getSigner();
    default:
      throw new ValidationError('Invalid authorization header');
  }
}
