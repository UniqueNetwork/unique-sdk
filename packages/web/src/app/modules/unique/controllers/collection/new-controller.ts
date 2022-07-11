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
import {
  CollectionInfoWithSchemaResponse,
  CreateCollectionNewRequest,
  CreateCollectionResponse,
} from './types';
import { BaseCollectionController } from './base-controller';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('collection-new')
@Controller('collection-new')
export class NewCollectionController extends BaseCollectionController {
  constructor(readonly sdk: Sdk, @Inject(CACHE_MANAGER) readonly cache: Cache) {
    super(sdk, cache);
  }

  @Get()
  async getCollection(
    @Query() args: CollectionIdQuery,
  ): Promise<CollectionInfoWithSchemaResponse> {
    const collection = await this.sdk.collections.get_new(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @MutationMethod(Post(), CreateCollectionNewRequest, CreateCollectionResponse)
  @ApiOperation({
    description: 'Create a new collection',
  })
  createCollectionMutation(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.collections.creation_new,
      cache: this.cache,
    };
  }
}
