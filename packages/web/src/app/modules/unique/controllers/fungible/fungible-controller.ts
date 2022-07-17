import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  Query,
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
import {
  CreateFungibleCollectionRequest,
  FungibleCollectionInfoDto,
} from './types';
import { CollectionIdQuery, CreateCollectionResponse } from '../collection';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('fungible')
@Controller('fungible')
export class FungibleController {
  constructor(
    readonly sdk: Sdk,
    @Inject(CACHE_MANAGER) readonly cache: Cache,
  ) {}

  @Get('collection')
  @ApiResponse({ type: FungibleCollectionInfoDto })
  async getCollection(
    @Query() args: CollectionIdQuery,
  ): Promise<FungibleCollectionInfoDto> {
    const collection = await this.sdk.fungible.getCollection(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

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
