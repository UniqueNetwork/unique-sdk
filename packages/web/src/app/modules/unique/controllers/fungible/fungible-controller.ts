import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CACHE_MANAGER,
  Controller,
  Inject,
  Post,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { Sdk } from '@unique-nft/sdk';
import { Cache } from 'cache-manager';
import { SdkValidationPipe } from '../../../../validation';
import { SdkExceptionsFilter } from '../../../../utils/exception-filter';
import {
  MutationMethod,
  MutationMethodOptions,
} from '../../../../decorators/mutation-method';
import { CreateFungibleCollectionRequest } from './types';
import { CreateCollectionResponse } from '../collection';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('fungible')
@Controller('fungible')
export class FungibleController {
  constructor(
    readonly sdk: Sdk,
    @Inject(CACHE_MANAGER) readonly cache: Cache,
  ) {}

  @MutationMethod(
    Post('collection'),
    CreateFungibleCollectionRequest,
    CreateCollectionResponse,
  )
  @ApiOperation({
    description: 'Create a new fungible collection',
  })
  createCollectionMutation(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.fungible.createCollection,
      cache: this.cache,
    };
  }
}
