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
} from './controllers';
import { GlobalConfigModule } from './config/config.module';
import { SignerMiddleware } from './middlewares/signer.middleware';
import { SdkExceptionsFilter } from './utils/exception-filter';
import { sdkProvider } from './sdk-provider';
import { IpfsModule } from './ipfs/module';
import { ContentTypeHeaderValidationMiddleware } from './middlewares/content-type-header-validation.middleware';

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
