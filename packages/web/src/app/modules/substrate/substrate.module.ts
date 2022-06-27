import { DynamicModule, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ExtrinsicsController } from './controllers/extrinsics.controller';
import { BalanceController } from './controllers/balance.controller';
import { ChainController } from './controllers/chain.controller';
import { InfoController } from './controllers/info.controller';
import { QueryController } from './controllers/query.controller';
import { AccountController } from './controllers/account.controller';
import { SdkProviderModule } from '../sdk-provider/sdk-provider.module';
import { SubstratePrimaryModule } from './substrate.primary.module';

const controllers = [
  ExtrinsicsController,
  BalanceController,
  ChainController,
  InfoController,
  QueryController,
  AccountController,
];

@Module({})
export class SubstrateModule {
  static forSecondary(): DynamicModule {
    const { SECONDARY_CHAIN_WS_URL, SECONDARY_CHAIN_NAME } = process.env;

    if (!(SECONDARY_CHAIN_WS_URL && SECONDARY_CHAIN_NAME)) {
      return {
        module: SubstrateModule,
      };
    }

    return {
      controllers,
      module: SubstrateModule,
      imports: [
        SdkProviderModule.forSecondary(),
        RouterModule.register([
          {
            path: SECONDARY_CHAIN_NAME,
            module: SubstrateModule,
          },
        ]),
      ],
    };
  }

  static forPrimary(): DynamicModule {
    return {
      module: SubstratePrimaryModule,
    };
  }
}
