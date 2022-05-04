import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import {
  BurnCollectionDto,
  CollectionGetRequest,
  CollectionResponse,
  CreateCollectionDto,
  ExtrinsicBuildResponse,
  TransferCollectionDto,
} from '../dto';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getCollection(
    @Query() args: CollectionGetRequest,
  ): Promise<CollectionResponse> {
    const collection = await this.sdk.query.collection(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @Post()
  async createCollection(
    @Body() args: CreateCollectionDto,
  ): Promise<ExtrinsicBuildResponse> {
    return this.sdk.collection.create(args);
  }

  @Delete()
  async burnCollection(
    @Body() args: BurnCollectionDto,
  ): Promise<ExtrinsicBuildResponse> {
    return this.sdk.collection.burn(args);
  }

  @Patch('transfer')
  async transferCollection(
    @Body() args: TransferCollectionDto,
  ): Promise<ExtrinsicBuildResponse> {
    return this.sdk.collection.transfer(args);
  }
}
