import { Module } from '@nestjs/common';
import {
  TokenController,
  NewTokenController,
} from './controllers/token.controller';
import {
  CollectionController,
  NewCollectionController,
} from './controllers/collection.controller';
import { SubstrateModule } from '../substrate/substrate.module';
import { SdkProviderModule } from '../sdk-provider/sdk-provider.module';

@Module({
  imports: [SdkProviderModule, SubstrateModule.forPrimary()],
  controllers: [
    TokenController,
    NewTokenController,
    CollectionController,
    NewCollectionController,
  ],
})
export class UniqueModule {}
