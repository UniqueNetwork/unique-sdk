import { DynamicModule, Module } from '@nestjs/common';
import { ChainController } from './controllers/chain.controller';
import { ExtrinsicsController } from './controllers/extrinsics.controller';
import { QueryController } from './controllers/query.controller';
import { AccountController } from './controllers/account.controller';
import { BalanceController } from './controllers/balance.controller';
import { ModuleWithSecondarySdkProvider } from '../module-with-secondary-sdk-provider/module-with-secondary-sdk-provider.module';

@Module({
  controllers: [
    ChainController,
    ExtrinsicsController,
    BalanceController,
    AccountController,
    QueryController,
  ],
  imports: [
    ModuleWithSecondarySdkProvider.secondary({
      wsUrl: process.env.SECONDARY_KSM,
    }),
  ],
})
export class CommonModule {}
