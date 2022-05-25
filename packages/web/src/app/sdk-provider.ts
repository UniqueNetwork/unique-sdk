import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import {
  createSigner,
  SeedSignerOptions,
  SignerOptions,
} from '@unique-nft/sdk/sign';
import { Sdk } from '@unique-nft/sdk';

import '@unique-nft/sdk/balance';

import { SignerConfig } from './config/config.module';

function createSignerOptions(configService: ConfigService): SignerOptions {
  const { seed } = configService.get<SignerConfig>('signer');
  if (seed) return new SeedSignerOptions(seed);
  return null;
}

export const sdkProvider: Provider = {
  inject: [ConfigService],
  provide: Sdk,
  useFactory: async (configService: ConfigService) => {
    const signerOptions: SignerOptions = createSignerOptions(configService);
    const signer = signerOptions ? await createSigner(signerOptions) : null;

    const sdk = new Sdk({
      signer,
      chainWsUrl: configService.get('chainWsUrl'),
      ipfsGatewayUrl: configService.get('ipfsGatewayUrl'),
    });

    await sdk.isReady;

    return sdk;
  },
};
