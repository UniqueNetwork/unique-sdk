import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { SignerMiddleware } from '../middlewares/signer.middleware';

export class SignerNestModule implements NestModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SignerMiddleware)
      .forRoutes({ path: '/*', method: RequestMethod.POST });
  }
}
