import { Module } from '@nestjs/common';
import { ExtrinsicsController } from './controllers/extrinsics.controller';
import { BalanceController } from './controllers/balance.controller';
import { ChainController } from './controllers/chain.controller';
import { InfoController } from './controllers/info.controller';
import { QueryController } from './controllers/query.controller';
import { AccountController } from './controllers/account.controller';
import { SdkProviderModule } from '../sdk-provider/sdk-provider.module';

const controllers = [
  ExtrinsicsController,
  BalanceController,
  ChainController,
  InfoController,
  QueryController,
  AccountController,
];

@Module({
  controllers,
  imports: [SdkProviderModule],
})
export class SubstratePrimaryModule {}
