import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import { createSigner, SignerOptions } from '@unique-nft/sdk/sign';
import { Sdk } from '@unique-nft/sdk';

import '@unique-nft/sdk/state-queries';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';

import { SignerConfig } from './config/config.module';

function createSignerOptions(configService: ConfigService): SignerOptions {
  const { seed } = configService.get<SignerConfig>('signer');
  if (seed) return { seed };
  return null;
}

export const sdkProvider: Provider = {
  inject: [ConfigService],
  provide: Sdk,
  useFactory: async (configService: ConfigService) => {
    const signerOptions: SignerOptions = createSignerOptions(configService);
    const signer = signerOptions ? await createSigner(signerOptions) : null;

    return Sdk.create({
      signer,
      chainWsUrl: configService.get('chainWsUrl'),
    });
  },
};
