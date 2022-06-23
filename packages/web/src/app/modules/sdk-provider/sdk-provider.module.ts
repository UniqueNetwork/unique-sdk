import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sdk } from '@unique-nft/sdk';
import { createSigner, SeedSignerOptions } from '@unique-nft/sdk/sign';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Config } from '../../config/config.module';

import '@unique-nft/sdk/state-queries';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';


async function sdkFactory(
  chainWsUrl: Config['chainWsUrl'] | Config['secondary']['chainWsUrl'],
  signerOptions: Config['signer'] | Config['secondary']['signer'],
  ipfsGatewayUrl: string,
): Promise<Sdk> {
  const signer = signerOptions?.seed ? await createSigner(signerOptions as SeedSignerOptions) : null;
  const sdk = new Sdk({
    signer,
    chainWsUrl,
    ipfsGatewayUrl,
  });

  await sdk.isReady;

  return sdk;
}


@Module({
  providers: [
    SdkProviderModule.primaryProvider(),
  ],
  exports: [
    Sdk,
  ],
})
export class SdkProviderModule {

  static primaryProvider(): FactoryProvider {
    return {
      provide: Sdk,
      useFactory: async (configService: ConfigService<Config>) => {
        return sdkFactory(
          configService.get('chainWsUrl'),
          configService.get('signer'),
          configService.get('ipfsGatewayUrl'),
        );
      },
      inject: [ConfigService],
    };
  }

  static secondaryProvider(): FactoryProvider {
    return {
      provide: Sdk,
      useFactory: async (configService: ConfigService<Config>) => {
        const { chainWsUrl, signer } = configService.get('secondary');
        return sdkFactory(
          chainWsUrl,
          signer,
          configService.get('ipfsGatewayUrl'),
        );
      },
      inject: [ConfigService],
    };
  }

  static forSecondary(): DynamicModule {
    return {
      module: SdkProviderModule,
      providers: [
        SdkProviderModule.secondaryProvider(),
      ],
      exports: [ Sdk ],
    };
  }

}
