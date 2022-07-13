import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  UseFilters,
  UsePipes,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Sdk } from '@unique-nft/sdk';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../../../../utils/exception-filter';
import { CollectionIdQuery } from '../../../../types/sdk-methods';
import { SdkValidationPipe } from '../../../../validation';
import {
  MutationMethod,
  MutationMethodOptions,
} from '../../../../decorators/mutation-method';
import { CollectionInfoResponse } from '../../../../types/unique-types';
import { CreateCollectionBody, CreateCollectionResponse } from './types';
import { BaseCollectionController } from './base-controller';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('collection')
@Controller('collection')
export class OldCollectionController extends BaseCollectionController {
  constructor(readonly sdk: Sdk, @Inject(CACHE_MANAGER) readonly cache: Cache) {
    super(sdk, cache);
  }

  @Get()
  async getCollection(
    @Query() args: CollectionIdQuery,
  ): Promise<CollectionInfoResponse> {
    const collection = await this.sdk.collections.get(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @MutationMethod(Post(), CreateCollectionBody, CreateCollectionResponse)
  @ApiOperation({
    description: 'Create a new collection',
  })
  createCollectionMutation(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.collections.creation,
      cache: this.cache,
    };
  }
}
