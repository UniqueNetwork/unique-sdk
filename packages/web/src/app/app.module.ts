/* eslint-disable class-methods-use-this */
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Sdk } from '@unique-nft/sdk';
import { ConfigService } from '@nestjs/config';
import { SignerOptions, createSigner } from '@unique-nft/sdk/sign';

import {
  BalanceController,
  ChainController,
  CollectionController,
  ExtrinsicsController,
  TokenController,
  AccountController,
} from './controllers';
import { GlobalConfigModule, SignerConfig } from './config/config.module';
import { SignerMiddleware } from './middlewares/signer.middleware';
import { SdkExceptionsFilter } from './utils/exception-filter';

function createSignerOptions(configService: ConfigService): SignerOptions {
  const { seed } = configService.get<SignerConfig>('signer');
  if (seed) return { seed };
  return null;
}

export const sdkProvider = {
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

@Module({
  imports: [GlobalConfigModule, SignerMiddleware],
  controllers: [
    ChainController,
    ExtrinsicsController,
    BalanceController,
    CollectionController,
    TokenController,
    AccountController,
  ],
  providers: [
    sdkProvider,
    {
      provide: APP_FILTER,
      useClass: SdkExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SignerMiddleware)
      .forRoutes({ path: '/extrinsic/*', method: RequestMethod.POST });
  }
}
