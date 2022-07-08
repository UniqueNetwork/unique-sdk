import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../../../utils/exception-filter';
import { CollectionIdQuery } from '../../../types/sdk-methods';
import { SdkValidationPipe } from '../../../validation';
import { CollectionInfoWithSchemaResponse } from '../../../types/unique-types';
import { CollectionController } from './collection.controller';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('collection (with unique schema)')
@Controller('collection-new')
export class CollectionNewController extends CollectionController {
  constructor(sdk: Sdk) {
    super(sdk);
  }

  @Get()
  async getCollectionNew(
    @Query() args: CollectionIdQuery,
  ): Promise<CollectionInfoWithSchemaResponse> {
    const collection = await this.sdk.collections.get_new(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }
}
