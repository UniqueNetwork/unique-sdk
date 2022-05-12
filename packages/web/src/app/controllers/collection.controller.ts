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

import {
  BurnCollectionArgs,
  CollectionIdArg,
  CollectionInfo,
  CreateCollectionArgs,
  Sdk,
} from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import {
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
    @Query() args: CollectionIdArg,
  ): Promise<CollectionInfo> {
    const collection = await this.sdk.query.collection(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @Post()
  async createCollection(
    @Body() args: CreateCollectionArgs,
  ): Promise<ExtrinsicBuildResponse> {
    return this.sdk.collection.create(args);
  }

  @Delete()
  async burnCollection(
    @Query() args: BurnCollectionArgs,
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
