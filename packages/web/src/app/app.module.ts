import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Module } from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { ConfigService } from '@nestjs/config';
import {
  SeedSignerOptions,
  SignerOptions,
  UriSignerOptions,
  createSigner,
} from '@unique-nft/sdk/sign';

import {
  BalanceController,
  ChainController,
  CollectionController,
  ExtrinsicsController,
  TokenController,
} from './controllers';
import { GlobalConfigModule } from './config/config.module';

function createSignerOptions(configService: ConfigService): SignerOptions {
  const seed = configService.get('signerSeed');
  if (seed) {
    return new SeedSignerOptions(seed);
  }
  const uri = configService.get('signerUri');
  if (uri) {
    return new UriSignerOptions(uri);
  }
  return null;
}

export const sdkProvider = {
  inject: [ConfigService],
  provide: Sdk,
  useFactory: async (configService: ConfigService) => {
    await cryptoWaitReady();
    const signerOptions: SignerOptions = createSignerOptions(configService);
    const signer = signerOptions ? await createSigner(signerOptions) : null;

    const sdk = new Sdk({
      chainWsUrl: configService.get('chainWsUrl'),
      ipfsGatewayUrl: configService.get('ipfsGatewayUrl'),
      signer,
    });

    await sdk.isReady;

    return sdk;
  },
};

@Module({
  imports: [GlobalConfigModule],
  controllers: [
    ChainController,
    BalanceController,
    ExtrinsicsController,
    CollectionController,
    TokenController,
  ],
  providers: [sdkProvider],
})
export class AppModule {}
