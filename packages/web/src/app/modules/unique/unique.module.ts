import { Module } from '@nestjs/common';
import {
  OldCollectionController,
  NewCollectionController,
} from './controllers/collection';
import { OldTokenController, NewTokenController } from './controllers/token';
import { FungibleController } from './controllers/fungible/fungible-controller';

import { SubstrateModule } from '../substrate/substrate.module';
import { SdkProviderModule } from '../sdk-provider/sdk-provider.module';
import { SignerNestModule } from '../../utils/signer.module';

@Module({
  imports: [SdkProviderModule, SubstrateModule.forPrimary()],
  controllers: [
    OldTokenController,
    NewTokenController,
    OldCollectionController,
    NewCollectionController,
    FungibleController,
  ],
})
export class UniqueModule extends SignerNestModule {}
