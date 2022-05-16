import { Module } from '@nestjs/common';
import { Sdk, SignerType } from '@unique-nft/sdk';
import { ConfigService } from '@nestjs/config';

import {
  BalanceController,
  ChainController,
  CollectionController,
  ExtrinsicsController,
  TokenController,
} from './controllers';
import { GlobalConfigModule } from './config/config.module';

export const sdkProvider = {
  inject: [ConfigService],
  provide: Sdk,
  useFactory: async (configService: ConfigService) => {
    const sdk = new Sdk({
      chainWsUrl: configService.get('chainWsUrl'),
      ipfsGatewayUrl: configService.get('ipfsGatewayUrl'),
      signer: {
        type: SignerType.SEED,
        seed: configService.get('signerSeed'),
      },
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
