/* eslint-disable class-methods-use-this */
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import {
  BalanceController,
  ChainController,
  CollectionController,
  ExtrinsicsController,
  TokenController,
  AccountController,
  QueryController,
  InfoController,
} from './controllers';
import { GlobalConfigModule } from './config/config.module';
import { SignerMiddleware } from './middlewares/signer.middleware';
import { SdkExceptionsFilter } from './utils/exception-filter';
import { sdkProvider } from './sdk-provider';
import { IpfsModule } from './modules/ipfs/module';
import { ContentTypeHeaderValidationMiddleware } from './middlewares/content-type-header-validation.middleware';
import { cacheProvider } from './modules/cache';

@Module({
  imports: [GlobalConfigModule, SignerMiddleware, IpfsModule.register()],
  controllers: [
    ChainController,
    ExtrinsicsController,
    BalanceController,
    CollectionController,
    TokenController,
    AccountController,
    QueryController,
    InfoController,
  ],
  providers: [
    sdkProvider,
    cacheProvider,
    {
      provide: APP_FILTER,
      useClass: SdkExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContentTypeHeaderValidationMiddleware).forRoutes(
      {
        path: '/*',
        method: RequestMethod.POST,
      },
      {
        path: '/*',
        method: RequestMethod.PUT,
      },
      {
        path: '/*',
        method: RequestMethod.DELETE,
      },
      {
        path: '/*',
        method: RequestMethod.PATCH,
      },
    );
    consumer
      .apply(SignerMiddleware)
      .forRoutes({ path: '/extrinsic/*', method: RequestMethod.POST });
  }
}
