import { Module } from '@nestjs/common';
import { TokenController } from './controllers/token.controller';
import { CollectionController } from './controllers/collection';
import { SubstrateModule } from '../substrate/substrate.module';
import { SdkProviderModule } from '../sdk-provider/sdk-provider.module';

@Module({
  imports: [SdkProviderModule, SubstrateModule.forPrimary()],
  controllers: [TokenController, CollectionController],
})
export class UniqueModule {}
