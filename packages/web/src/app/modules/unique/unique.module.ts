import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TokenController } from './controllers/token.controller';
import { CollectionController } from './controllers/collection.controller';
import { ChainController } from '../common/controllers/chain.controller';
import { ExtrinsicsController } from '../common/controllers/extrinsics.controller';
import { BalanceController } from '../common/controllers/balance.controller';
import { AccountController } from '../common/controllers/account.controller';
import { QueryController } from '../common/controllers/query.controller';
import { sdkProviderFactoryInstance } from '../../factory-sdk';

@Module({
  imports: [CommonModule],
  controllers: [
    ChainController,
    ExtrinsicsController,
    BalanceController,
    AccountController,
    QueryController,
    TokenController,
    CollectionController,
  ],
  providers: [sdkProviderFactoryInstance.create('chainWsUrl')],
})
export class UniqueModule {}
