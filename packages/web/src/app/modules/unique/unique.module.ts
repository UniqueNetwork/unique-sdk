import { Module } from '@nestjs/common';
import { CreateCollectionExMutation } from '@unique-nft/sdk/tokens';
import { TokenController } from './controllers/token.controller';
import { CollectionController } from './controllers/collection.controller';
import { SubstrateModule } from '../substrate/substrate.module';
import { SdkProviderModule } from '../sdk-provider/sdk-provider.module';
import {
  CreateCollectionBody,
  CollectionIdResponse,
} from '../../types/sdk-methods';
import { getControllerClass } from '../../utils/mutation-controller';

const collectionCreateController = getControllerClass({
  MutationConstructor: CreateCollectionExMutation,
  inputDto: CreateCollectionBody,
  outputDto: CollectionIdResponse,
  sectionPath: 'collection',
  methodPath: 'create',
});

@Module({
  imports: [SdkProviderModule, SubstrateModule.forPrimary()],
  controllers: [
    TokenController,
    CollectionController,
    collectionCreateController,
  ],
})
export class UniqueModule {}
