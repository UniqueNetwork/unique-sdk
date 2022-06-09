import { DynamicModule, Module, Global } from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { ConfigService } from '@nestjs/config';
import { sdkSecondaryProvider } from '../../sdk-secondary-provider';

@Global()
@Module({})
export class ModuleWithSecondarySdkProvider {
  static secondary(options: { wsUrl: string }): DynamicModule {
    return {
      module: ModuleWithSecondarySdkProvider,
      providers: [
        {
          inject: [ConfigService],
          provide: Sdk,
          useFactory: async (configService: ConfigService) => {
            const sdk = new Sdk({
              chainWsUrl: options.wsUrl,
              ipfsGatewayUrl: configService.get('ipfsGatewayUrl'),
            });

            await sdk.isReady;

            return sdk;
          },
        },
        sdkSecondaryProvider,
      ],
      exports: [Sdk],
    };
  }
}
