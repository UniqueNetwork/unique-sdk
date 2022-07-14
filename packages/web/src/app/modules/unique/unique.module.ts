import { Module } from '@nestjs/common';
import {
  OldCollectionController,
  NewCollectionController,
} from './controllers/collection';
import { OldTokenController, NewTokenController } from './controllers/token';

import { SubstrateModule } from '../substrate/substrate.module';
import { SdkProviderModule } from '../sdk-provider/sdk-provider.module';

@Module({
  imports: [SdkProviderModule, SubstrateModule.forPrimary()],
  controllers: [
    OldTokenController,
    NewTokenController,
    OldCollectionController,
    NewCollectionController,
  ],
})
export class UniqueModule {}
