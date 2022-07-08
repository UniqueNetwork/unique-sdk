import { Module } from '@nestjs/common';
import { TokenController } from './controllers/token.controller';
import { TokenNewController } from './controllers/token.new.controller';
import { CollectionController } from './controllers/collection.controller';
import { CollectionNewController } from './controllers/collection.new.controller';
import { SubstrateModule } from '../substrate/substrate.module';
import { SdkProviderModule } from '../sdk-provider/sdk-provider.module';

@Module({
  imports: [SdkProviderModule, SubstrateModule.forPrimary()],
  controllers: [
    TokenController,
    TokenNewController,
    CollectionController,
    CollectionNewController,
  ],
})
export class UniqueModule {}
