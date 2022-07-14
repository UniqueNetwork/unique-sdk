import { Sdk } from '@unique-nft/sdk';
import { SignatureType } from '@unique-nft/accounts';
import { KeyringProvider } from '@unique-nft/accounts/keyring';

import { Config } from '../../config/config.module';
import './accounts';

export async function sdkFactory(
  chainWsUrl: Config['chainWsUrl'] | Config['secondary']['chainWsUrl'],
  signerOptions: Config['signer'] | Config['secondary']['signer'],
): Promise<Sdk> {
  const keyringProvider = new KeyringProvider({
    type: SignatureType.Sr25519,
  });
  await keyringProvider.init();

  const signerSeed = signerOptions?.seed;
  const signer = signerSeed
    ? keyringProvider.addSeed(signerSeed).getSigner()
    : null;

  const sdk = new Sdk({
    signer,
    chainWsUrl,
  });

  await sdk.accounts.initProvider(keyringProvider);

  await sdk.connect();

  return sdk;
}
