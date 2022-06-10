import { DynamicModule, Module, Global } from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { sdkProviderFactoryInstance } from "../../factory-sdk";

@Global()
@Module({})
export class ModuleWithSecondarySdkProvider {
  static secondary(): DynamicModule {
    return {
      module: ModuleWithSecondarySdkProvider,
      providers: [
        process.env.SECONDARY_CHAIN_WS_URL
          ? sdkProviderFactoryInstance.create('secondaryChainWsUr')
          : sdkProviderFactoryInstance.create('chainWsUrl'),
      ],
      exports: [Sdk],
    };
  }
}
