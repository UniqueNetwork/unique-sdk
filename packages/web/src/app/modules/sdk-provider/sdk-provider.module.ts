import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Sdk } from '@unique-nft/sdk';
import '@unique-nft/sdk/state-queries';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/fungible';

import { Config } from '../../config/config.module';
import { sdkFactory } from './factory';

@Module({
  providers: [SdkProviderModule.primaryProvider()],
  exports: [Sdk],
})
export class SdkProviderModule {
  static primaryProvider(): FactoryProvider {
    return {
      provide: Sdk,
      useFactory: async (configService: ConfigService<Config>) =>
        sdkFactory(
          configService.get('chainWsUrl'),
          configService.get('signer'),
        ),
      inject: [ConfigService],
    };
  }

  static secondaryProvider(): FactoryProvider {
    return {
      provide: Sdk,
      useFactory: async (configService: ConfigService<Config>) => {
        const { chainWsUrl, signer } = configService.get('secondary');
        return sdkFactory(chainWsUrl, signer);
      },
      inject: [ConfigService],
    };
  }

  static forSecondary(): DynamicModule {
    return {
      module: SdkProviderModule,
      providers: [SdkProviderModule.secondaryProvider()],
      exports: [Sdk],
    };
  }
}
