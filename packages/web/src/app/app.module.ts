/* eslint-disable class-methods-use-this */
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { GlobalConfigModule } from './config/config.module';
import { SignerMiddleware } from './middlewares/signer.middleware';
import { SdkExceptionsFilter } from './utils/exception-filter';
import { IpfsModule } from './ipfs/module';
import { ContentTypeHeaderValidationMiddleware } from './middlewares/content-type-header-validation.middleware';
import { UniqueModule } from './modules/unique/unique.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    GlobalConfigModule,
    SignerMiddleware,
    IpfsModule.register(),
    UniqueModule,
    CommonModule,
    RouterModule.register([
      {
        path: '',
        module: UniqueModule,
        children: [CommonModule],
      },
      {
        path: 'ksm',
        module: CommonModule,
      },
    ]),
  ],
  providers: [
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
