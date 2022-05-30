/* eslint-disable class-methods-use-this */
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
  CacheModule,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import {
  BalanceController,
  ChainController,
  CollectionController,
  ExtrinsicsController,
  TokenController,
  AccountController,
} from './controllers';
import { GlobalConfigModule } from './config/config.module';
import { SignerMiddleware } from './middlewares/signer.middleware';
import { SdkExceptionsFilter } from './utils/exception-filter';
import { sdkProvider } from './sdk-provider';

@Module({
  imports: [
    GlobalConfigModule,
    SignerMiddleware,
    CacheModule.register({ ttl: 60 }),
  ],
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
