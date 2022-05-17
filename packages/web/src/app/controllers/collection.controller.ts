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
import {
  BurnCollectionArgs,
  CollectionIdArg,
  CollectionInfo,
  CreateCollectionArgs,
  TransferCollectionArgs,
} from '@unique-nft/sdk/types';
import { ApiTags } from '@nestjs/swagger';
import { UnsignedTxPayload } from '@unique-nft/sdk/extrinsics';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getCollection(@Query() args: CollectionIdArg): Promise<CollectionInfo> {
    const collection = await this.sdk.collection.get(args);

    if (collection) return collection;

    throw new NotFoundException(`no collection with id ${args.collectionId}`);
  }

  @Post()
  async createCollection(
    @Body() args: CreateCollectionArgs,
  ): Promise<UnsignedTxPayload> {
    return this.sdk.collection.create(args);
  }

  @Delete()
  async burnCollection(
    @Query() args: BurnCollectionArgs,
  ): Promise<UnsignedTxPayload> {
    return this.sdk.collection.burn(args);
  }

  @Patch('transfer')
  async transferCollection(
    @Body() args: TransferCollectionArgs,
  ): Promise<UnsignedTxPayload> {
    return this.sdk.collection.transfer(args);
  }
}
